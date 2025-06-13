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


/* The main program loads a game DLL and checks
once per frame if it changed. If changed, then
it loads it as a new game DLL. It will feed the
new DLL the memory the old one used. */
main :: proc() {
	rl.SetConfigFlags(({.VSYNC_HINT}))
	rl.InitWindow(WINDOW_SIZE, WINDOW_SIZE, "Odin 3D")
	rl.SetTargetFPS(500)

	soundManager := sounds.init()


	g := game.init()
	graphics := graphics.init()


	// Tell the game to start itself up!

	// same as while(true) in C
	for {
		/* This updates and renders the game. It
    returns false when we want to exit the
    program (break the main loop). */
		game.tick(&g, &graphics, soundManager)
		game.render(&g, &graphics)

	}
}
