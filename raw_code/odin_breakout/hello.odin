package snake

import rl "vendor:raylib"

WINDOW_SIZE :: 1000
GRID_WIDTH :: 20
CELL_SIZE :: 16
CANVAS_SIZE :: GRID_WIDTH * CELL_SIZE
Vec2i :: [2]int
TICK_RATE :: 0.13
tick_timer: f32 = TICK_RATE


restart :: proc() {
}


tick :: proc() {
	tick_timer -= rl.GetFrameTime()
	if tick_timer <= 0 {
		tick_timer = TICK_RATE
	}
}

render :: proc() {
	rl.BeginDrawing()
	rl.ClearBackground({76, 53, 83, 255})

	camera := rl.Camera2D {
		zoom = f32(WINDOW_SIZE) / CANVAS_SIZE,
	}
	rl.BeginMode2D(camera)

	rl.EndMode2D()
	rl.EndDrawing()

}
main :: proc() {
	rl.SetConfigFlags(({.VSYNC_HINT}))
	rl.InitWindow(WINDOW_SIZE, WINDOW_SIZE, "Snake")
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
