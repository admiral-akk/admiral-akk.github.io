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
	engine:       mini.engine,
	// need to avoid reallocation
	sounds:       []Sound,
	sounds_len:   int,
	other_sounds: [dynamic]Sound,
}

Sound :: struct {
	name:         string,
	pcm:          []f32,
	bufferConfig: mini.audio_buffer_config,
	buffer:       mini.audio_buffer,
	sound:        mini.sound,
}

SoundParams :: struct {
	freq:    f32,
	attack:  f32,
	sustain: f32,
	decay:   f32,
}

playSound :: proc(manager: ^SoundManager, name: string, delay: u64) {
	for i in 0 ..< manager.sounds_len {
		if manager.sounds[i].name == name {

			append(&manager.other_sounds, Sound{})

			sounds := &manager.other_sounds[len(manager.other_sounds) - 1]
			sounds.bufferConfig = mini.audio_buffer_config_init(
				.f32,
				CHANNELS,
				u64(len(manager.sounds[i].pcm)),
				&manager.sounds[i].pcm[0],
				nil,
			)

			dataSourceConfig := mini.data_source_config_init()
			dataSource := transmute(^mini.data_source)(&sounds.buffer)

			mini.data_source_init(&dataSourceConfig, dataSource)
			result := mini.audio_buffer_init(&sounds.bufferConfig, &sounds.buffer)

			flags: bit_set[mini.sound_flag;u32]
			flags = {}

			result = mini.sound_init_from_data_source(
				&manager.engine,
				dataSource,
				flags,
				nil,
				&sounds.sound,
			)
			fmt.println("play", result)
			mini.sound_set_start_time_in_milliseconds(
				&sounds.sound,
				delay + mini.engine_get_time_in_milliseconds(&manager.engine),
			)
			mini.sound_start(&sounds.sound)
			return
		}
	}
}

addSound :: proc(manager: ^SoundManager, name: string, params: SoundParams) -> ^Sound {
	frameCount := int(SAMPLE_RATE * (params.attack + params.decay + params.sustain))
	sounds := &manager.sounds[manager.sounds_len]
	manager.sounds_len += 1
	sounds.name = name
	sounds.pcm = make([]f32, frameCount * CHANNELS)
	for i in 0 ..< frameCount {

		t := f32(i) / SAMPLE_RATE
		volume: f32 = 0
		if t <= params.attack {
			volume = 1. - (params.attack - t) / params.attack
		} else if t <= params.attack + params.sustain {
			volume = 1.0
		} else if t <= params.attack + params.sustain + params.decay {
			volume = (params.attack + params.sustain + params.decay - t) / params.decay
		}
		volume = 1.0
		sounds.pcm[i] = 0.1 * volume * math.sin(math.TAU * params.freq * t)
	}


	sounds.bufferConfig = mini.audio_buffer_config_init(
		.f32,
		CHANNELS,
		u64(frameCount),
		&sounds.pcm[0],
		nil,
	)

	dataSourceConfig := mini.data_source_config_init()
	dataSource := transmute(^mini.data_source)(&sounds.buffer)

	mini.data_source_init(&dataSourceConfig, dataSource)
	result := mini.audio_buffer_init(&sounds.bufferConfig, &sounds.buffer)

	flags: bit_set[mini.sound_flag;u32]
	flags = {}

	result = mini.sound_init_from_data_source(
		&manager.engine,
		dataSource,
		flags,
		nil,
		&sounds.sound,
	)
	fmt.println("Sound result", name, result)
	fmt.println("buffer result", sounds.buffer.ownsData)
	return sounds
}


init :: proc() -> ^SoundManager {

	soundManager := new(SoundManager)
	soundManager.sounds_len = 0
	soundManager.sounds = make([]Sound, 100)
	soundManager.engine = mini.engine{}
	config := mini.engine_config_init()
	config.channels = CHANNELS
	config.sampleRate = SAMPLE_RATE
	config.listenerCount = 1
	result := mini.engine_init(&config, &soundManager.engine)
	fmt.println("result", result)
	engine_start_result := mini.engine_start(&soundManager.engine)
	fmt.println("start", engine_start_result)

	addSound(
		soundManager,
		"C",
		SoundParams{attack = 0.05, decay = 0.05, sustain = 0.02, freq = 440.},
	)
	addSound(
		soundManager,
		"C#",
		SoundParams {
			attack = 0.05,
			decay = 0.05,
			sustain = 0.02,
			freq = 440. * math.pow_f32(2., 1. / 12.),
		},
	)
	addSound(
		soundManager,
		"D",
		SoundParams {
			attack = 0.05,
			decay = 0.05,
			sustain = 0.02,
			freq = 440. * math.pow_f32(2., 2. / 12.),
		},
	)
	addSound(
		soundManager,
		"D#",
		SoundParams {
			attack = 0.05,
			decay = 0.05,
			sustain = 0.02,
			freq = 440. * math.pow_f32(2., 3. / 12.),
		},
	)
	addSound(
		soundManager,
		"E",
		SoundParams {
			attack = 0.05,
			decay = 0.05,
			sustain = 0.02,
			freq = 440. * math.pow_f32(2., 4. / 12.),
		},
	)
	addSound(
		soundManager,
		"F",
		SoundParams {
			attack = 0.05,
			decay = 0.05,
			sustain = 0.02,
			freq = 440. * math.pow_f32(2., 5. / 12.),
		},
	)
	addSound(
		soundManager,
		"F#",
		SoundParams {
			attack = 0.05,
			decay = 0.05,
			sustain = 0.02,
			freq = 440. * math.pow_f32(2., 6. / 12.),
		},
	)
	addSound(
		soundManager,
		"G",
		SoundParams {
			attack = 0.05,
			decay = 0.05,
			sustain = 0.02,
			freq = 440. * math.pow_f32(2., 7. / 12.),
		},
	)
	addSound(
		soundManager,
		"C6",
		SoundParams {
			attack = 0.02,
			decay = 0.02,
			sustain = 0.0,
			freq = 440. * math.pow_f32(2., 24. / 12.),
		},
	)
	return soundManager
}
