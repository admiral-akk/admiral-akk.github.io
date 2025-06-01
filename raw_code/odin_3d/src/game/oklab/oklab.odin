package oklab

import "core:math"
import rl "vendor:raylib"

OkLab :: [4]f32

// we use LCh representation, because it's more intuitive.
// Lightness: [0,1]
// Chroma: [0,1]
// Hue: [0,1]

// https://bottosson.github.io/posts/oklab/
// returns gamma corrected color
color :: proc(lab: OkLab) -> [4]f32 {

	oklab := [3]f32{lab.x, lab.y * math.cos(math.TAU * lab.z), lab.y * math.sin(math.TAU * lab.z)}
	l_ := oklab.x + 0.3963377774 * oklab.y + 0.2158037573 * oklab.z
	m_ := oklab.x - 0.1055613458 * oklab.y - 0.0638541728 * oklab.z
	s_ := oklab.x - 0.0894841775 * oklab.y - 1.2914855480 * oklab.z

	l := l_ * l_ * l_
	m := m_ * m_ * m_
	s := s_ * s_ * s_

	r := math.pow(math.saturate(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s), 1. / 2.2)
	g := math.pow(math.saturate(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s), 1. / 2.2)
	b := math.pow(math.saturate(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s), 1. / 2.2)

	return [4]f32{r, g, b, lab.w}
}


rlColor :: proc(lab: OkLab) -> rl.Color {
	color := 255 * color(lab)
	return rl.Color{u8(color.r), u8(color.g), u8(color.b), u8(color.a)}
}
