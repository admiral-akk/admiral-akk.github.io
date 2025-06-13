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

SoundManager :: struct {
	engine: mini.engine,
	sounds: map[string]Sound,
}

Sound :: struct {
	pcm:    []f32,
	buffer: mini.audio_buffer,
	sound:  mini.sound,
}

SoundParams :: struct {
	freq:   f32,
	attack: f32,
	decay:  f32,
}

addSound :: proc(manager: ^SoundManager, name: string, params: SoundParams) -> ^Sound {
	frameCount := SAMPLE_RATE * DURATION_SECONDS
	_, sounds, _, _ := map_entry(&manager.sounds, "base")
	sounds.pcm = make([]f32, frameCount * CHANNELS)
	for i in 0 ..< frameCount {
		t := f32(i) / SAMPLE_RATE
		sounds.pcm[i] = 0.1 * math.sin(math.TAU * FREQUENCY * t)
	}


	bufferConfig := mini.audio_buffer_config_init(
		.f32,
		CHANNELS,
		u64(frameCount),
		&sounds.pcm[0],
		nil,
	)


	result := mini.audio_buffer_init(&bufferConfig, &sounds.buffer)
	fmt.println("buffer result", result)

	flags: bit_set[mini.sound_flag;u32]
	flags = {}

	result = mini.sound_init_from_data_source(
		&manager.engine,
		transmute(^mini.data_source)(&sounds.buffer),
		flags,
		nil,
		&sounds.sound,
	)
	fmt.println("Sound result", result)
	return sounds
}


init :: proc() -> ^SoundManager {
	soundManager := new(SoundManager)
	soundManager.engine = mini.engine{}
	config := mini.engine_config_init()
	config.channels = CHANNELS
	config.sampleRate = SAMPLE_RATE
	config.listenerCount = 1
	result := mini.engine_init(&config, &soundManager.engine)
	fmt.println("result", result)
	engine_start_result := mini.engine_start(&soundManager.engine)
	fmt.println("start", engine_start_result)

	frameCount := SAMPLE_RATE * DURATION_SECONDS

	sounds := addSound(soundManager, "base", SoundParams{})

	return soundManager
}
