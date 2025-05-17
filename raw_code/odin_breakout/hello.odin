package snake

import "core:math"
import "core:math/linalg"
import rl "vendor:raylib"

WINDOW_SIZE :: 1280
SCREEN_SIZE :: 320
GRID_WIDTH :: 20
CELL_SIZE :: 16
CANVAS_SIZE :: GRID_WIDTH * CELL_SIZE
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

started: bool

restart :: proc() {
	paddle_pos_x = 0.5 * (SCREEN_SIZE - PADDLE_WIDTH)
	ball_pos = {0.5 * SCREEN_SIZE, BALL_START_Y}
	ball_dir = {0, 0}
	started = false
}


tick :: proc() {
	if !started {
		ball_pos = {SCREEN_SIZE * (0.5 + 0.3 * f32(math.cos(rl.GetTime()))), BALL_START_Y}

		if rl.IsKeyPressed(.SPACE) {
			paddle_middle := rl.Vector2{paddle_pos_x + 0.5 * PADDLE_WIDTH, PADDLE_POS_Y}
			ball_to_paddle := paddle_middle - ball_pos

			ball_dir = linalg.normalize0(ball_to_paddle)
			started = true
		}
	} else {
		tick_timer -= rl.GetFrameTime()
	}
	if tick_timer <= 0 {

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
		previous_ball_pos := ball_pos
		ball_pos += ball_dir * TICK_RATE * BALL_SPEED
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
				ball_dir = linalg.normalize(
					linalg.reflect(ball_dir, linalg.normalize((collision_normal))),
				)
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

	rl.DrawRectangleRec(paddle_rect, {50, 150, 90, 255})

	rl.DrawCircleV(ball_pos, BALL_RADIUS, {200, 90, 20, 255})
	rl.EndMode2D()
	rl.EndDrawing()

}
main :: proc() {
	rl.SetConfigFlags(({.VSYNC_HINT}))
	rl.InitWindow(WINDOW_SIZE, WINDOW_SIZE, "Snake")
	rl.SetTargetFPS(500)
	rl.InitAudioDevice()
	restart()

	for !rl.WindowShouldClose() {
		tick()
		render()
		free_all(context.temp_allocator)
	}

	rl.CloseAudioDevice()
	rl.CloseWindow()
}
