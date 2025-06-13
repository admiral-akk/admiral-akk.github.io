package sounds

import "base:runtime"
import "core:c/libc"
import "core:dynlib"
import "core:fmt"
import "core:math"
import "core:os"
import "core:time"
import mini "vendor:miniaudio"

SAMPLE_RATE :: 44100
FREQUENCY :: 440
DURATION_SECONDS :: 2
CHANNELS :: 1

Sound :: struct {
	engine: mini.engine,
	pcm:    []f32,
}

init :: proc() -> ^Sound {
	sounds := new(Sound)
	sounds.engine = mini.engine{}
	config := mini.engine_config_init()
	config.channels = CHANNELS
	config.sampleRate = SAMPLE_RATE
	config.listenerCount = 1
	result := mini.engine_init(&config, &sounds.engine)
	fmt.println("result", result)
	engine_start_result := mini.engine_start(&sounds.engine)
	fmt.println("start", engine_start_result)

	frameCount := SAMPLE_RATE * DURATION_SECONDS

	sounds.pcm = make([]f32, frameCount * CHANNELS)
	for i in 0 ..< frameCount {
		t := f32(i) / SAMPLE_RATE
		sounds.pcm[i] = 0.1 * math.sin(math.TAU * FREQUENCY * t)
	}
	return sounds
}
