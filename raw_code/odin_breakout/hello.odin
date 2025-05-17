package snake

import "core:fmt"
import "core:math"
import "core:math/linalg"
import rl "vendor:raylib"

WINDOW_SIZE :: 1280
SCREEN_SIZE :: 320
Vec2i :: [2]int
TICK_RATE :: 0.02
tick_timer: f32 = TICK_RATE

PADDLE_WIDTH :: 50
PADDLE_HEIGHT :: 6
PADDLE_POS_Y :: 260
PADDLE_SPEED :: 200
paddle_pos_x: f32
paddle_move_velocity: f32

BALL_SPEED :: 260
BALL_RADIUS :: 4
BALL_START_Y :: 160

ball_pos: rl.Vector2
ball_dir: rl.Vector2

start_time_offset: f64

game_over: bool
started: bool

NUM_BLOCKS_X :: 10
NUM_BLOCKS_Y :: 8
blocks: [NUM_BLOCKS_X][NUM_BLOCKS_Y]bool

BLOCK_WIDTH :: 28
BLOCK_X_PADDING :: 20
BLOCK_HEIGHT :: 10
BLOCK_Y_PADDING :: 40

score: int

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

ball_texture: rl.Texture2D
paddle_texture: rl.Texture2D
hit_block_sound: rl.Sound
hit_paddle_sound: rl.Sound
game_over_sound: rl.Sound

restart :: proc() {
	paddle_pos_x = 0.5 * (SCREEN_SIZE - PADDLE_WIDTH)
	ball_pos = {0.5 * SCREEN_SIZE, BALL_START_Y}
	ball_dir = {0, 0}
	start_time_offset = rl.GetTime()
	started = false
	score = 0
	game_over = false

	for x in 0 ..< NUM_BLOCKS_X {
		for y in 0 ..< NUM_BLOCKS_Y {
			blocks[x][y] = true
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
	return x >= 0 && y >= 0 && x < NUM_BLOCKS_X && y < NUM_BLOCKS_Y && blocks[x][y]
}


tick :: proc() {
	if !started {
		ball_pos = {
			SCREEN_SIZE * (0.5 + 0.3 * f32(math.sin(rl.GetTime() - start_time_offset))),
			BALL_START_Y,
		}

		if rl.IsKeyPressed(.SPACE) {
			paddle_middle := rl.Vector2{paddle_pos_x + 0.5 * PADDLE_WIDTH, PADDLE_POS_Y}
			ball_to_paddle := paddle_middle - ball_pos

			ball_dir = linalg.normalize0(ball_to_paddle)
			started = true
		}
	} else if game_over {
		if rl.IsKeyPressed(.SPACE) {
			restart()
		}
	} else {
		tick_timer -= rl.GetFrameTime()
	}
	if tick_timer <= 0 {

		previous_ball_pos := ball_pos
		ball_pos += ball_dir * TICK_RATE * BALL_SPEED

		if ball_pos.x + BALL_RADIUS > SCREEN_SIZE {
			ball_pos.x = SCREEN_SIZE - BALL_RADIUS
			ball_dir = reflect(ball_dir, rl.Vector2{-1, 0})
		}
		if ball_pos.x - BALL_RADIUS < 0 {
			ball_pos.x = BALL_RADIUS
			ball_dir = reflect(ball_dir, rl.Vector2{1, 0})
		}
		if ball_pos.y - BALL_RADIUS < 0 {
			ball_pos.y = BALL_RADIUS
			ball_dir = reflect(ball_dir, rl.Vector2{0, 1})
		}
		if !game_over && ball_pos.y + BALL_RADIUS > SCREEN_SIZE + 6 * BALL_RADIUS {
			game_over = true
			rl.PlaySound(game_over_sound)
		}


		paddle_move_velocity = 0
		if rl.IsKeyDown(.LEFT) {
			paddle_move_velocity -= PADDLE_SPEED
		}
		if rl.IsKeyDown(.RIGHT) {
			paddle_move_velocity += PADDLE_SPEED
		}

		paddle_pos_x += paddle_move_velocity * TICK_RATE
		paddle_pos_x = clamp(paddle_pos_x, 0, SCREEN_SIZE - PADDLE_WIDTH)

		paddle_rect := rl.Rectangle{paddle_pos_x, PADDLE_POS_Y, PADDLE_WIDTH, PADDLE_HEIGHT}
		if rl.CheckCollisionCircleRec(ball_pos, BALL_RADIUS, paddle_rect) {
			collision_normal: rl.Vector2

			if previous_ball_pos.y < paddle_rect.y + paddle_rect.height {
				collision_normal += {0, -1}
				ball_pos.y = paddle_rect.y - BALL_RADIUS
			} else {
				collision_normal += {0, 1}
				ball_pos.y = paddle_rect.y + paddle_rect.height + BALL_RADIUS
			}

			if previous_ball_pos.x < paddle_rect.x {
				collision_normal += {-1, 0}

			} else if previous_ball_pos.x > paddle_rect.x + paddle_rect.width {
				collision_normal += {1, 0}
			}

			if collision_normal != 0 {
				ball_dir = reflect(ball_dir, collision_normal)

				rl.PlaySound(hit_paddle_sound)
			}
		}

		block_x_loop: for x in 0 ..< NUM_BLOCKS_X {
			for y in 0 ..< NUM_BLOCKS_Y {
				if blocks[x][y] {
					block_rect := calc_block_rect(x, y)

					if rl.CheckCollisionCircleRec(ball_pos, BALL_RADIUS, block_rect) {

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
							ball_dir = reflect(ball_dir, collision_normal)
						}

						blocks[x][y] = false
						score += block_color_score[row_colors[y]]
						rl.PlaySound(hit_block_sound)
						break block_x_loop
					}
				}
			}
		}


		tick_timer = TICK_RATE
	}
}

render :: proc() {
	rl.BeginDrawing()
	rl.ClearBackground({76, 53, 83, 255})

	camera := rl.Camera2D {
		zoom = f32(rl.GetScreenHeight()) / SCREEN_SIZE,
	}
	rl.BeginMode2D(camera)

	paddle_rect := rl.Rectangle{paddle_pos_x, PADDLE_POS_Y, PADDLE_WIDTH, PADDLE_HEIGHT}

	rl.DrawTexturePro(
		paddle_texture,
		rl.Rectangle{0, 0, f32(paddle_texture.width), f32(paddle_texture.height)},
		paddle_rect,
		rl.Vector2{0, 0},
		0,
		rl.WHITE,
	)

	for x in 0 ..< NUM_BLOCKS_X {
		for y in 0 ..< NUM_BLOCKS_Y {
			if blocks[x][y] {
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
		ball_pos.x - BALL_RADIUS,
		ball_pos.y - BALL_RADIUS,
		2 * BALL_RADIUS,
		2 * BALL_RADIUS,
	}

	rl.DrawTexturePro(
		ball_texture,
		rl.Rectangle{0, 0, f32(ball_texture.width), f32(ball_texture.height)},
		ball_rect,
		rl.Vector2{0, 0},
		0,
		rl.WHITE,
	)

	score_text := fmt.ctprint(score)
	rl.DrawText(score_text, 5, 5, 10, rl.WHITE)

	if !started {
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

	if game_over {
		game_over_text := fmt.ctprintf("Score: %v. Reset: SPACE", score)
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
main :: proc() {
	rl.SetConfigFlags(({.VSYNC_HINT}))
	rl.InitWindow(WINDOW_SIZE, WINDOW_SIZE, "Snake")
	rl.SetTargetFPS(500)
	rl.InitAudioDevice()

	ball_texture = rl.LoadTexture("assets/ball.png")
	paddle_texture = rl.LoadTexture("assets/paddle.png")

	hit_block_sound = rl.LoadSound("assets/hit_block.wav")
	hit_paddle_sound = rl.LoadSound("assets/hit_paddle.wav")
	game_over_sound = rl.LoadSound("assets/game_over.wav")

	restart()

	for !rl.WindowShouldClose() {
		tick()
		render()
		free_all(context.temp_allocator)
	}

	rl.UnloadSound(hit_block_sound)
	rl.UnloadSound(hit_paddle_sound)
	rl.UnloadSound(game_over_sound)

	rl.UnloadTexture(ball_texture)
	rl.UnloadTexture(paddle_texture)

	rl.CloseAudioDevice()
	rl.CloseWindow()
}
