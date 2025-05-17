package game

import "core:fmt"
import "core:math"
import "core:math/linalg"
import "core:math/rand"
import rl "vendor:raylib"

WINDOW_SIZE :: 1280
SCREEN_SIZE :: 320
Vec2i :: [2]int
TICK_RATE :: 0.02

PADDLE_WIDTH :: 50
PADDLE_HEIGHT :: 6
PADDLE_POS_Y :: 260
PADDLE_SPEED :: 200

BALL_SPEED :: 260
BALL_RADIUS :: 4
BALL_START_Y :: 160


NUM_BLOCKS_X :: 10
NUM_BLOCKS_Y :: 8

BLOCK_WIDTH :: 28
BLOCK_X_PADDING :: 20
BLOCK_HEIGHT :: 10
BLOCK_Y_PADDING :: 40


block_color_score := [Block_Color]int {
	.Yellow = 2,
	.Green  = 4,
	.Orange = 6,
	.Red    = 8,
}

Block_Color :: enum {
	Yellow,
	Green,
	Orange,
	Red,
}

row_colors := [NUM_BLOCKS_Y]Block_Color {
	.Red,
	.Red,
	.Orange,
	.Orange,
	.Green,
	.Green,
	.Yellow,
	.Yellow,
}

block_color_values := [Block_Color]rl.Color {
	.Yellow = {253, 249, 150, 255},
	.Green  = {180, 245, 190, 255},
	.Orange = {170, 120, 250, 255},
	.Red    = {250, 90, 85, 255},
}

/* Our game's state lives within this struct. In
order for hot reload to work the game's memory
must be transferable from one game DLL to
another when a hot reload occurs. We can do that
when all the game's memory live in here. */
GameMemory :: struct {
	some_state:           int,
	ball_texture:         rl.Texture2D,
	paddle_texture:       rl.Texture2D,
	hit_block_sound:      rl.Sound,
	hit_paddle_sound:     rl.Sound,
	game_over_sound:      rl.Sound,
	blocks:               [NUM_BLOCKS_X][NUM_BLOCKS_Y]bool,
	score:                int,
	start_time_offset:    f64,
	game_over:            bool,
	started:              bool,
	ball_pos:             rl.Vector2,
	ball_dir:             rl.Vector2,
	tick_timer:           f32,
	paddle_pos_x:         f32,
	paddle_move_velocity: f32,
}

g_mem: ^GameMemory


restart :: proc() {
	g_mem.paddle_pos_x = 0.5 * (SCREEN_SIZE - PADDLE_WIDTH)
	g_mem.ball_pos = {0.5 * SCREEN_SIZE, BALL_START_Y}
	g_mem.ball_dir = {0, 0}
	g_mem.start_time_offset = rl.GetTime()
	g_mem.started = false
	g_mem.score = 0
	g_mem.game_over = false

	for x in 0 ..< NUM_BLOCKS_X {
		for y in 0 ..< NUM_BLOCKS_Y {
			g_mem.blocks[x][y] = true
		}
	}
}

calc_block_rect :: proc(x, y: int) -> rl.Rectangle {
	return {
		f32(BLOCK_X_PADDING + x * BLOCK_WIDTH),
		f32(BLOCK_Y_PADDING + y * BLOCK_HEIGHT),
		BLOCK_WIDTH,
		BLOCK_HEIGHT,
	}

}

reflect :: proc(dir, normal: rl.Vector2) -> rl.Vector2 {

	return linalg.normalize(linalg.reflect(dir, normal))
}

block_exists :: proc(x, y: int) -> bool {
	return x >= 0 && y >= 0 && x < NUM_BLOCKS_X && y < NUM_BLOCKS_Y && g_mem.blocks[x][y]
}


tick :: proc() {
	if !g_mem.started {
		g_mem.ball_pos = {
			SCREEN_SIZE * (0.5 + 0.3 * f32(math.sin(rl.GetTime() - g_mem.start_time_offset))),
			BALL_START_Y,
		}

		if rl.IsKeyPressed(.SPACE) {
			paddle_middle := rl.Vector2{g_mem.paddle_pos_x + 0.5 * PADDLE_WIDTH, PADDLE_POS_Y}
			ball_to_paddle := paddle_middle - g_mem.ball_pos

			g_mem.ball_dir = linalg.normalize0(ball_to_paddle)
			g_mem.started = true
		}
	} else if g_mem.game_over {
		if rl.IsKeyPressed(.SPACE) {
			restart()
		}
	} else {
		g_mem.tick_timer -= rl.GetFrameTime()
	}
	if g_mem.tick_timer <= 0 {

		previous_ball_pos := g_mem.ball_pos
		g_mem.ball_pos += g_mem.ball_dir * TICK_RATE * BALL_SPEED

		if g_mem.ball_pos.x + BALL_RADIUS > SCREEN_SIZE {
			g_mem.ball_pos.x = SCREEN_SIZE - BALL_RADIUS
			g_mem.ball_dir = reflect(g_mem.ball_dir, rl.Vector2{-1, 0})
		}
		if g_mem.ball_pos.x - BALL_RADIUS < 0 {
			g_mem.ball_pos.x = BALL_RADIUS
			g_mem.ball_dir = reflect(g_mem.ball_dir, rl.Vector2{1, 0})
		}
		if g_mem.ball_pos.y - BALL_RADIUS < 0 {
			g_mem.ball_pos.y = BALL_RADIUS
			g_mem.ball_dir = reflect(g_mem.ball_dir, rl.Vector2{0, 1})
		}
		if !g_mem.game_over && g_mem.ball_pos.y + BALL_RADIUS > SCREEN_SIZE + 6 * BALL_RADIUS {
			g_mem.game_over = true
			rl.PlaySound(g_mem.game_over_sound)
		}


		g_mem.paddle_move_velocity = 0
		if rl.IsKeyDown(.LEFT) {
			g_mem.paddle_move_velocity -= PADDLE_SPEED
		}
		if rl.IsKeyDown(.RIGHT) {
			g_mem.paddle_move_velocity += PADDLE_SPEED
		}

		g_mem.paddle_pos_x += g_mem.paddle_move_velocity * TICK_RATE
		g_mem.paddle_pos_x = clamp(g_mem.paddle_pos_x, 0, SCREEN_SIZE - PADDLE_WIDTH)

		paddle_rect := rl.Rectangle{g_mem.paddle_pos_x, PADDLE_POS_Y, PADDLE_WIDTH, PADDLE_HEIGHT}
		if rl.CheckCollisionCircleRec(g_mem.ball_pos, BALL_RADIUS, paddle_rect) {
			collision_normal: rl.Vector2

			if previous_ball_pos.y < paddle_rect.y + paddle_rect.height {
				collision_normal += {0, -1}
				g_mem.ball_pos.y = paddle_rect.y - BALL_RADIUS
			} else {
				collision_normal += {0, 1}
				g_mem.ball_pos.y = paddle_rect.y + paddle_rect.height + BALL_RADIUS
			}

			if previous_ball_pos.x < paddle_rect.x {
				collision_normal += {-1, 0}

			} else if previous_ball_pos.x > paddle_rect.x + paddle_rect.width {
				collision_normal += {1, 0}
			}

			if collision_normal != 0 {
				g_mem.ball_dir = reflect(g_mem.ball_dir, collision_normal)

				rl.PlaySound(g_mem.hit_paddle_sound)
			}
		}

		block_x_loop: for x in 0 ..< NUM_BLOCKS_X {
			for y in 0 ..< NUM_BLOCKS_Y {
				if g_mem.blocks[x][y] {
					block_rect := calc_block_rect(x, y)

					if rl.CheckCollisionCircleRec(g_mem.ball_pos, BALL_RADIUS, block_rect) {

						collision_normal: rl.Vector2
						if previous_ball_pos.y < block_rect.y {
							collision_normal += {0, -1}
						} else if previous_ball_pos.y > block_rect.y + block_rect.height {
							collision_normal += {0, 1}
						}

						if previous_ball_pos.x < block_rect.x {
							collision_normal += {-1, 0}
						} else if previous_ball_pos.x > block_rect.x + block_rect.width {
							collision_normal += {1, 0}
						}

						if block_exists(x + int(collision_normal.x), y) {
							collision_normal.x = 0
						}

						if block_exists(x, y + int(collision_normal.y)) {
							collision_normal.y = 0
						}

						if collision_normal != 0 {
							g_mem.ball_dir = reflect(g_mem.ball_dir, collision_normal)
						}

						g_mem.blocks[x][y] = false
						g_mem.score += block_color_score[row_colors[y]]
						rl.SetSoundPitch(g_mem.hit_block_sound, rand.float32_range(0.8, 1.2))
						rl.PlaySound(g_mem.hit_block_sound)
						break block_x_loop
					}
				}
			}
		}


		g_mem.tick_timer = TICK_RATE
	}
}

render :: proc() {
	rl.BeginDrawing()
	rl.ClearBackground({76, 53, 83, 255})

	camera := rl.Camera2D {
		zoom = f32(rl.GetScreenHeight()) / SCREEN_SIZE,
	}
	rl.BeginMode2D(camera)

	paddle_rect := rl.Rectangle{g_mem.paddle_pos_x, PADDLE_POS_Y, PADDLE_WIDTH, PADDLE_HEIGHT}

	rl.DrawTexturePro(
		g_mem.paddle_texture,
		rl.Rectangle{0, 0, f32(g_mem.paddle_texture.width), f32(g_mem.paddle_texture.height)},
		paddle_rect,
		rl.Vector2{0, 0},
		0,
		rl.WHITE,
	)

	for x in 0 ..< NUM_BLOCKS_X {
		for y in 0 ..< NUM_BLOCKS_Y {
			if g_mem.blocks[x][y] {
				block_rect := calc_block_rect(x, y)

				top_left := rl.Vector2{block_rect.x, block_rect.y}

				top_right := rl.Vector2{block_rect.x + block_rect.width, block_rect.y}

				bottom_right := rl.Vector2 {
					block_rect.x + block_rect.width,
					block_rect.y + block_rect.height,
				}
				bottom_left := rl.Vector2{block_rect.x, block_rect.y + block_rect.height}

				rl.DrawRectangleRec(block_rect, block_color_values[row_colors[y]])
				rl.DrawLineEx(top_left, top_right, 1, {255, 255, 150, 100})
				rl.DrawLineEx(top_right, bottom_right, 1, {255, 255, 150, 100})
				rl.DrawLineEx(bottom_right, bottom_left, 1, {255, 255, 150, 100})
				rl.DrawLineEx(bottom_left, top_left, 1, {255, 255, 150, 100})
			}
		}
	}

	ball_rect := rl.Rectangle {
		g_mem.ball_pos.x - BALL_RADIUS,
		g_mem.ball_pos.y - BALL_RADIUS,
		2 * BALL_RADIUS,
		2 * BALL_RADIUS,
	}

	rl.DrawTexturePro(
		g_mem.ball_texture,
		rl.Rectangle{0, 0, f32(g_mem.ball_texture.width), f32(g_mem.ball_texture.height)},
		ball_rect,
		rl.Vector2{0, 0},
		0,
		rl.WHITE,
	)

	score_text := fmt.ctprint(g_mem.score)
	rl.DrawText(score_text, 5, 5, 10, rl.WHITE)

	if !g_mem.started {
		start_text := fmt.ctprintf("Start: SPACE")
		start_text_width := rl.MeasureText(start_text, 15)
		rl.DrawText(
			start_text,
			SCREEN_SIZE / 2 - start_text_width / 2,
			BALL_START_Y - 30,
			15,
			rl.WHITE,
		)
	}

	if g_mem.game_over {
		game_over_text := fmt.ctprintf("Score: %v. Reset: SPACE", g_mem.score)
		game_over_text_width := rl.MeasureText(game_over_text, 15)
		rl.DrawText(
			game_over_text,
			SCREEN_SIZE / 2 - game_over_text_width / 2,
			BALL_START_Y - 30,
			15,
			rl.WHITE,
		)
	}
	rl.EndMode2D()
	rl.EndDrawing()

}
loop :: proc() {


	for !rl.WindowShouldClose() {
		tick()
		render()
		free_all(context.temp_allocator)
	}

	rl.UnloadSound(g_mem.hit_block_sound)
	rl.UnloadSound(g_mem.hit_paddle_sound)
	rl.UnloadSound(g_mem.game_over_sound)

	rl.UnloadTexture(g_mem.ball_texture)
	rl.UnloadTexture(g_mem.paddle_texture)

	rl.CloseAudioDevice()
	rl.CloseWindow()
}
/* Allocates the GameMemory that we use to store
  our game's state. We assign it to a global
  variable so we can use it from the other
  procedures. */
@(export)
game_init :: proc() {
	g_mem = new(GameMemory)
	rl.SetConfigFlags(({.VSYNC_HINT}))
	rl.InitWindow(WINDOW_SIZE, WINDOW_SIZE, "Snake")
	rl.SetTargetFPS(500)
	rl.InitAudioDevice()

	g_mem.ball_texture = rl.LoadTexture("assets/ball.png")
	g_mem.paddle_texture = rl.LoadTexture("assets/paddle.png")

	g_mem.hit_block_sound = rl.LoadSound("assets/hit_block.wav")
	g_mem.hit_paddle_sound = rl.LoadSound("assets/hit_paddle.wav")
	g_mem.game_over_sound = rl.LoadSound("assets/game_over.wav")
}

/* Allocates the GameMemory that we use to store
  our game's state. We assign it to a global
  variable so we can use it from the other
  procedures. */
@(export)
game_init_window :: proc() {

	restart()
}
/* Allocates the GameMemory that we use to store
	our game's state. We assign it to a global
	variable so we can use it from the other
	procedures. */
@(export)
game_shutdown_window :: proc() {
}

/* Simulation and rendering goes here. Return
  false when you wish to terminate the program. */
@(export)
game_update :: proc() -> bool {
	tick()
	render()
	free_all(context.temp_allocator)
	return true
}

/* Called by the main program when the main loop
  has exited. Clean up your memory here. */
@(export)
game_shutdown :: proc() {
	free(g_mem)
	rl.UnloadSound(g_mem.hit_block_sound)
	rl.UnloadSound(g_mem.hit_paddle_sound)
	rl.UnloadSound(g_mem.game_over_sound)

	rl.UnloadTexture(g_mem.ball_texture)
	rl.UnloadTexture(g_mem.paddle_texture)

	rl.CloseAudioDevice()
	rl.CloseWindow()
}

/* Returns a pointer to the game memory. When
  hot reloading, the main program needs a pointer
  to the game memory. It can then load a new game
  DLL and tell it to use the same memory by calling
  game_hot_reloaded on the new game DLL, supplying
  it the game memory pointer. */
@(export)
game_memory :: proc() -> rawptr {
	return g_mem
}

/* Used to set the game memory pointer after a
  hot reload occurs. See game_memory comments. */
@(export)
game_hot_reloaded :: proc(mem: ^GameMemory) {
	g_mem = mem
}
