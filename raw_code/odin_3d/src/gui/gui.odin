package gui
import "../game"
import "core:fmt"
import rl "vendor:raylib"

WINDOW_SIZE :: 720
SCREEN_SIZE :: 320
TICK_RATE :: 0.02

// Mouse buttons
ButtonState :: enum int {
	INACTIVE = 0,
	HOT      = 1,
	ACTIVE   = 2,
}

UIElement :: struct {
	id: int,
}

Button :: struct {
	using identifier: UIElement,
	hot:              bool,
	active:           bool,
	text:             string,
	position:         rl.Rectangle,
	state:            ButtonState,
}

UIState :: struct {
	button: Button,
}


tick :: proc(state: ^UIState) -> game.Command {
	// gui state 
	mp := rl.GetMousePosition() * SCREEN_SIZE / f32(WINDOW_SIZE)
	md := rl.IsMouseButtonDown(.LEFT)
	over_button := rl.CheckCollisionPointRec(mp, state.button.position)


	switch state.button.state {
	case .INACTIVE:
		if over_button {
			state.button.state = .HOT
		}
	case .HOT:
		if !over_button {
			state.button.state = .INACTIVE
		} else if md {
			state.button.state = .ACTIVE
		}
	case .ACTIVE:
		if !md {
			state.button.state = .INACTIVE
			if over_button {
				return .CLICKED
			}
		}
	}
	return .NONE
}

render :: proc(state: ^UIState, game_state: ^game.GameState) {

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

	score := fmt.ctprint(game_state.score)
	size := rl.MeasureTextEx(rl.GetFontDefault(), score, 14, 0)
	rl.DrawText(score, 100 - i32(size.x / 2), 100 - i32(size.y / 2), 14, {240, 240, 240, 255})
	//fmt.println(mp)

	rl.EndMode2D()
}
