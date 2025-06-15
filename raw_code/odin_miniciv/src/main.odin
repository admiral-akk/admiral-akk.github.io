package reload

import "base:runtime"
import "core:c/libc"
import "core:dynlib"
import "core:fmt"
import "core:math"
import "core:os"
import "core:time"
import "game"
import gfx "graphics"
import s "sounds"
import mini "vendor:miniaudio"
import rl "vendor:raylib"

// This manages any global managers, like graphics, sound effects, images, networking, and the
// game state itself.
//
// It also coordinates the main game loop.
main :: proc() {
	rl.SetConfigFlags(({.VSYNC_HINT}))
	rl.InitWindow(game.WINDOW_SIZE, game.WINDOW_SIZE, "Mini Civ")
	rl.SetTargetFPS(500)

	s.init()

	g := game.init()
	gfx.init()

	// Tell the game to start itself up!
	// same as while(true) in C
	for {
		game.tick(g)
		game.render()
		free_all(context.temp_allocator)
	}
}
