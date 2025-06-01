package oklab

import "core:math"
import rl "vendor:raylib"

OkLab :: [4]f32

// https://bottosson.github.io/posts/oklab/
color :: proc(oklab: OkLab) -> rl.Color {
	l_ := oklab.x + 0.3963377774 * oklab.y + 0.2158037573 * oklab.z
	m_ := oklab.x - 0.1055613458 * oklab.y - 0.0638541728 * oklab.z
	s_ := oklab.x - 0.0894841775 * oklab.y - 1.2914855480 * oklab.z

	l := l_ * l_ * l_
	m := m_ * m_ * m_
	s := s_ * s_ * s_


	return rl.Color {
		u8(
			math.round(
				255 * math.saturate(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
			),
		),
		u8(
			math.round(
				255 * math.saturate(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
			),
		),
		u8(
			math.round(
				255 * math.saturate(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s),
			),
		),
		u8(math.round(255 * math.saturate(oklab.w))),
	}
}
