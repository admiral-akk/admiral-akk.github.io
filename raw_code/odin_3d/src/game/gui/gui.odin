package gui
import "../oklab"
import rl "vendor:raylib"

WINDOW_SIZE :: 720
SCREEN_SIZE :: 320
TICK_RATE :: 0.02

TextBox :: struct {
	position:  rl.Vector2,
	font_size: f32,
	text_val:  cstring,
	color:     oklab.OkLab,
}

render_text_box :: proc(text_box: TextBox) {
	size := rl.MeasureTextEx(rl.GetFontDefault(), text_box.text_val, text_box.font_size, 0)
	color := text_box.color
	color.a = 1
	rl.DrawText(
		text_box.text_val,
		i32(text_box.position.x - size.x / 2),
		i32(text_box.position.y - size.y / 2),
		i32(text_box.font_size),
		oklab.color(color),
	)
}

Button :: struct {
	color:    rl.Color,
	position: rl.Rectangle,
}

render_button :: proc(button: Button) {
	rl.DrawRectangleRec(button.position, button.color)
	rl.DrawRectangleLinesEx(button.position, 1, {50, 50, 50, 255})
}
