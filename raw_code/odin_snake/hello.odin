package snake

import rl "vendor:raylib"

WINDOW_SIZE :: 1000
GRID_WIDTH :: 20
CELL_SIZE :: 16
CANVAS_SIZE :: GRID_WIDTH * CELL_SIZE
Vec2i :: [2]int
TICK_RATE :: 0.13

MAX_SNAKE_LENGTH :: GRID_WIDTH * GRID_WIDTH

snake: [MAX_SNAKE_LENGTH]Vec2i
snake_length: int
tick_timer: f32 = TICK_RATE
move_direction: Vec2i
game_over: bool

restart :: proc() {

	start_head_pos := Vec2i{GRID_WIDTH / 2, GRID_WIDTH / 2}
	snake[0] = start_head_pos
	snake[1] = snake[0] - {0, 1}
	snake[2] = snake[1] - {0, 1}

	move_direction = {0, 1}
	snake_length = 3
	game_over = false
}

tick :: proc() {
	if rl.IsKeyPressed(.UP) {
		move_direction = {0, -1}
	}
	if rl.IsKeyPressed(.DOWN) {
		move_direction = {0, 1}
	}
	if rl.IsKeyPressed(.LEFT) {
		move_direction = {-1, 0}
	}
	if rl.IsKeyPressed(.RIGHT) {
		move_direction = {1, 0}
	}
	if !game_over {
		tick_timer -= rl.GetFrameTime()
	} else if rl.IsKeyPressed(.ENTER) {
		restart()
	}
	if tick_timer <= 0 {
		for i := snake_length - 1; i > 0; i -= 1 {
			snake[i] = snake[i - 1]

		}
		snake[0] += move_direction
		tick_timer = TICK_RATE
		if snake[0].x < 0 ||
		   snake[0].y < 0 ||
		   snake[0].x >= GRID_WIDTH ||
		   snake[0].y >= GRID_WIDTH {
			game_over = true
		}
	}
}

render :: proc() {

	rl.BeginDrawing()
	rl.ClearBackground({76, 53, 83, 255})

	camera := rl.Camera2D {
		zoom = f32(WINDOW_SIZE) / CANVAS_SIZE,
	}
	rl.BeginMode2D(camera)
	for i in 0 ..< snake_length {
		head_rect := rl.Rectangle {
			f32(snake[i].x) * CELL_SIZE,
			f32(snake[i].y) * CELL_SIZE,
			CELL_SIZE,
			CELL_SIZE,
		}
		rl.DrawRectangleRec(head_rect, rl.WHITE)

	}

	rl.EndMode2D()


	rl.EndDrawing()

}
main :: proc() {
	rl.SetConfigFlags(({.VSYNC_HINT}))
	rl.InitWindow(WINDOW_SIZE, WINDOW_SIZE, "Snake")
	restart()
	for !rl.WindowShouldClose() {

		tick()
		render()
	}

	rl.CloseWindow()
}
