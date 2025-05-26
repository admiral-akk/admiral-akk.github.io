package gui
import "../game"
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
