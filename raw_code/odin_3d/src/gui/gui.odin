package gui
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

Command :: enum int {
	NONE    = 0,
	CLICKED = 1,
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

UIMemory :: struct {
	button: Button,
}
