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
	config: mini.engine_config,
}

init :: proc() -> ^Sound {
	sounds := new(Sound)
	sounds.engine = mini.engine{}
	sounds.config = mini.engine_config_init()
	sounds.config.channels = CHANNELS
	sounds.config.sampleRate = SAMPLE_RATE
	sounds.config.listenerCount = 1
	result := mini.engine_init(&sounds.config, &sounds.engine)
	fmt.println("result", result)
	engine_start_result := mini.engine_start(&sounds.engine)
	fmt.println("start", engine_start_result)
	return sounds
}
