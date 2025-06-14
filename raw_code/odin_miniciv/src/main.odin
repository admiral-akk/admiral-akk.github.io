package reload

import "base:runtime"
import "core:c/libc"
import "core:dynlib"
import "core:fmt"
import "core:math"
import "core:os"
import "core:time"
import "game"
import "graphics"
import "sounds"
import mini "vendor:miniaudio"
import rl "vendor:raylib"

WINDOW_SIZE :: 720
SCREEN_SIZE :: 320
TICK_RATE :: 0.02

SAMPLE_RATE :: 44100
FREQUENCY :: 440
DURATION_SECONDS :: 2
CHANNELS :: 1

// This manages any global managers, like graphics, sound effects, images, networking, and the
// game state itself.
//
// It also coordinates the main game loop.
main :: proc() {
	rl.SetConfigFlags(({.VSYNC_HINT}))
	rl.InitWindow(WINDOW_SIZE, WINDOW_SIZE, "Mini Civ")
	rl.SetTargetFPS(500)

	soundManager := sounds.init()

	g := game.init()
	graphics.init()

	// Tell the game to start itself up!
	// same as while(true) in C
	for {
		game.tick(&g, soundManager)
		game.render(&g)
	}
}
