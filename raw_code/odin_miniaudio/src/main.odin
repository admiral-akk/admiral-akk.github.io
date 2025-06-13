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

	engine := mini.engine{}
	config := mini.engine_config_init()
	config.channels = CHANNELS
	config.sampleRate = SAMPLE_RATE
	config.listenerCount = 1
	result := mini.engine_init(&config, &engine)
	fmt.println("result", result)
	engine_start_result := mini.engine_start(&engine)
	fmt.println("start", engine_start_result)


	// Step 2: Generate audio samples
	frameCount := SAMPLE_RATE * DURATION_SECONDS

	pcm := make([]f32, frameCount * CHANNELS)
	for i in 0 ..< frameCount {
		t := f32(i) / SAMPLE_RATE
		pcm[i] = 0.01 * math.sin(math.TAU * FREQUENCY * t)
	}
	bufferConfig := mini.audio_buffer_config_init(.f32, CHANNELS, u64(frameCount), &pcm[0], nil)

	buffer: mini.audio_buffer

	result = mini.audio_buffer_init(&bufferConfig, &buffer)
	flags: bit_set[mini.sound_flag;u32]
	flags = {}
	fmt.println("buffer result", result)

	sound: mini.sound
	result = mini.sound_init_from_data_source(
		&engine,
		transmute(^mini.data_source)(&buffer),
		flags,
		nil,
		&sound,
	)

	fmt.println("Sound result", result)

	mini.sound_start(&sound)

	g := game.init()
	graphics := graphics.init()
	//	time.sleep(time.Second * 2)


	// Tell the game to start itself up!

	// same as while(true) in C
	for {
		/* This updates and renders the game. It
    returns false when we want to exit the
    program (break the main loop). */
		game.tick(&g, &graphics)
		game.render(&g, &graphics)
		free_all(context.temp_allocator)

	}
}
