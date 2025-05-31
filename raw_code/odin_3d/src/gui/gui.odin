package gui
import "../game"
import "core:fmt"
import "core:math"
import rl "vendor:raylib"

WINDOW_SIZE :: 720
SCREEN_SIZE :: 320
TICK_RATE :: 0.02

TextBox :: struct {
	position:  rl.Vector2,
	font_size: f32,
	text_val:  cstring,
}

render_text_box :: proc(text_box: TextBox) {
	size := rl.MeasureTextEx(rl.GetFontDefault(), text_box.text_val, text_box.font_size, 0)
	rl.DrawText(
		text_box.text_val,
		i32(text_box.position.x - size.x / 2),
		i32(text_box.position.y - size.y / 2),
		i32(text_box.font_size),
		{240, 240, 240, 255},
	)
}

// Mouse buttons
tick :: proc(state: ^game.GameState) -> game.Command {

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

	text_val := fmt.ctprint(game_state.score.value)
	time_since_change := f32(rl.GetTime()) - game_state.score.last_changed
	font_size := math.max(14, 40 - 200 * time_since_change)
	render_text_box(
		TextBox{position = rl.Vector2{100, 100}, font_size = font_size, text_val = text_val},
	)
	//fmt.println(mp)

	rl.EndMode2D()
}
