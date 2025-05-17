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
food_pos: Vec2i

place_food :: proc() {
	occupied: [GRID_WIDTH][GRID_WIDTH]bool
	for i in 0 ..< snake_length {
		occupied[snake[i].x][snake[i].y] = true
	}

	free_cells := make([dynamic]Vec2i, context.temp_allocator)

	for x in 0 ..< GRID_WIDTH {
		for y in 0 ..< GRID_WIDTH {
			if !occupied[x][y] {
				append(&free_cells, Vec2i{x, y})
			}
		}
	}

	if len(free_cells) > 0 {
		random_cell_index := rl.GetRandomValue(0, i32(len(free_cells) - 1))
		food_pos = free_cells[random_cell_index]
	}
}

restart :: proc() {

	start_head_pos := Vec2i{GRID_WIDTH / 2, GRID_WIDTH / 2}
	snake[0] = start_head_pos
	snake[1] = snake[0] - {0, 1}
	snake[2] = snake[1] - {0, 1}

	move_direction = {0, 1}
	snake_length = 3
	game_over = false

	place_food()
}

tick :: proc() {
	new_move_dir := move_direction
	if rl.IsKeyPressed(.UP) {
		new_move_dir = {0, -1}
	}
	if rl.IsKeyPressed(.DOWN) {
		new_move_dir = {0, 1}
	}
	if rl.IsKeyPressed(.LEFT) {
		new_move_dir = {-1, 0}
	}
	if rl.IsKeyPressed(.RIGHT) {
		new_move_dir = {1, 0}
	}
	if new_move_dir != snake[1] - snake[0] {
		move_direction = new_move_dir
	}

	if !game_over {
		tick_timer -= rl.GetFrameTime()
	} else if rl.IsKeyPressed(.ENTER) {
		restart()
	}
	if tick_timer <= 0 {
		next_head_pos := snake[0] + move_direction
		for i := snake_length - 1; i > 0; i -= 1 {
			if next_head_pos == snake[i] {
				game_over = true
			}

			snake[i] = snake[i - 1]


		}
		snake[0] += move_direction

		if snake[0] == food_pos {
			snake_length += 1
			snake[snake_length - 1] = snake[snake_length - 2]
			place_food()
		}

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


	head_rect := rl.Rectangle {
		f32(food_pos.x) * CELL_SIZE,
		f32(food_pos.y) * CELL_SIZE,
		CELL_SIZE,
		CELL_SIZE,
	}
	rl.DrawRectangleRec(head_rect, rl.RED)

	for i in 0 ..< snake_length {
		head_rect := rl.Rectangle {
			f32(snake[i].x) * CELL_SIZE,
			f32(snake[i].y) * CELL_SIZE,
			CELL_SIZE,
			CELL_SIZE,
		}
		rl.DrawRectangleRec(head_rect, rl.WHITE)

	}

	if game_over {
		rl.DrawText("Game over!", 4, 4, 25, rl.RED)
		rl.DrawText("Press Enter to play again", 4, 30, 15, rl.BLACK)
	}

	rl.EndMode2D()


	rl.EndDrawing()

	free_all(context.temp_allocator)
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
