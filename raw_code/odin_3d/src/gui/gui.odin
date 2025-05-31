package gui
import "../game"
import "core:fmt"
import "core:math"
import rl "vendor:raylib"

WINDOW_SIZE :: 720
SCREEN_SIZE :: 320
TICK_RATE :: 0.02

// Mouse buttons
tick :: proc(state: ^game.GameState) -> game.Command {
	if state.ui_memory.score.font_size > 14 {
		state.ui_memory.score.font_size -= TICK_RATE * 275
		state.ui_memory.score.font_size = math.max(14, state.ui_memory.score.font_size)
	}

	mp := rl.GetMousePosition() * SCREEN_SIZE / f32(WINDOW_SIZE)
	md := rl.IsMouseButtonDown(.LEFT)
	over_button := rl.CheckCollisionPointRec(mp, state.ui_memory.button.position)
	switch state.ui_memory.button.state {
	case .INACTIVE:
		if over_button {
			state.ui_memory.button.state = .HOT
		}
	case .HOT:
		if !over_button {
			state.ui_memory.button.state = .INACTIVE
		} else if md {
			state.ui_memory.button.state = .ACTIVE
		}
	case .ACTIVE:
		if !md {
			state.ui_memory.button.state = .INACTIVE
			if over_button {
				return .CLICKED
			}
		}
	}
	return .NONE
}

apply :: proc(state: ^game.GameState, cmd: game.Command) {
	switch cmd {
	case .NONE:
	case .CLICKED:
		state.ui_memory.score.font_size = 40
	}
}

render :: proc(game_state: ^game.GameState) {
	state := game_state.ui_memory
	rl.BeginMode2D(rl.Camera2D{zoom = f32(WINDOW_SIZE) / SCREEN_SIZE})
	//mp := rl.GetMousePosition() * SCREEN_SIZE / f32(WINDOW_SIZE)

	button_color := rl.Color{200, 200, 200, 255}


	switch state.button.state {
	case .INACTIVE:
		button_color = rl.Color{200, 200, 200, 255}
	case .HOT:
		button_color = rl.Color{0, 200, 200, 255}
	case .ACTIVE:
		button_color = rl.Color{200, 0, 200, 255}
	}
	rl.DrawRectangleRec(state.button.position, button_color)
	rl.DrawRectangleLinesEx(state.button.position, 1, {50, 50, 50, 255})

	state.score.text_val = fmt.ctprint(game_state.score)
	size := rl.MeasureTextEx(rl.GetFontDefault(), state.score.text_val, state.score.font_size, 0)
	rl.DrawText(
		state.score.text_val,
		100 - i32(size.x / 2),
		100 - i32(size.y / 2),
		i32(state.score.font_size),
		{240, 240, 240, 255},
	)
	//fmt.println(mp)

	rl.EndMode2D()
}
