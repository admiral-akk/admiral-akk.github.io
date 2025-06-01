package reload

import "core:fmt"
import "core:math"
import "game"
import "graphics"
import rl "vendor:raylib"

WINDOW_SIZE :: 720
SCREEN_SIZE :: 320
TICK_RATE :: 0.02

/* Our game's state lives within this struct. In
order for hot reload to work the game's memory
must be transferable from one game DLL to
another when a hot reload occurs. We can do that
when all the game's memory live in here. */
GameMemory :: struct {
	audio_stream:    rl.AudioStream,
	tick_timer:      f32,
	audio_frame:     u32,
	audio_buffer:    [BUFFER_SIZE]f32,
	game_memory:     game.GameState,
	graphics_memory: graphics.GraphicsState,
}


g_mem: ^GameMemory

restart :: proc() {
	game.restart(&g_mem.game_memory)
	graphics.restart(&g_mem.graphics_memory)
}


/* Allocates the GameMemory that we use to store
  our game's state. We assign it to a global
  variable so we can use it from the other
  procedures. */
@(export)
game_init :: proc() {
	g_mem = new(GameMemory)
	rl.SetConfigFlags(({.VSYNC_HINT}))
	rl.InitWindow(WINDOW_SIZE, WINDOW_SIZE, "Snake")
	rl.SetTargetFPS(500)
	rl.InitAudioDevice()
	game_reload()
	g_mem.game_memory = game.init()
	restart()
}


generate_mesh :: proc() -> rl.Mesh {
	vertices: [dynamic]f32
	normals: [dynamic]f32
	texcoords: [dynamic]f32
	indices: [dynamic]u16
	colors: [dynamic]u8

	v := []rl.Vector3 {
		rl.Vector3{-0.5, -0.5, -0.5},
		rl.Vector3{-0.5, 0.5, -0.5},
		rl.Vector3{-0.5, 0.5, 0.5},
		rl.Vector3{-0.5, -0.5, 0.5},
		rl.Vector3{0.5, -0.5, -0.5},
		rl.Vector3{0.5, 0.5, -0.5},
		rl.Vector3{0.5, -0.5, 0.5},
		rl.Vector3{0.5, 0.5, 0.5},
	}

	centers := []rl.Vector3 {
		rl.Vector3{-0.5, 0.0, 0.0},
		rl.Vector3{0.5, 0.0, 0.0},
		rl.Vector3{0.0, -0.5, 0.0},
		rl.Vector3{0.0, 0.5, 0.0},
		rl.Vector3{0.0, 0.0, -0.5},
		rl.Vector3{0.0, 0.0, 0.5},
	}

	left := []rl.Vector3{v[0], v[1], v[2], v[3]}

	for i in 0 ..< 4 {
		v1 := left[i]
		v2 := left[(i + 1) % 4]
		append(&vertices, ..v2[:])
		append(&vertices, ..v1[:])
		append(&vertices, ..centers[0][:])
		norm := rl.Vector3Normalize(rl.Vector3CrossProduct(v1 - centers[0], v2 - centers[0]))
		append(&normals, ..norm[:])
		append(&normals, ..norm[:])
		append(&normals, ..norm[:])
		append(&texcoords, 0, 0)
		append(&texcoords, 0, 0)
		append(&texcoords, 0, 1.0 / math.SQRT_TWO)

		max_index := u16(len(indices))
		append(&indices, max_index, max_index + 1, max_index + 2)
	}

	// let's make some triangles?
	mesh := rl.Mesh {
		vertexCount   = i32(len(vertices) / 3),
		triangleCount = i32(len(indices) / 3),
		vertices      = raw_data(vertices),
		texcoords     = raw_data(texcoords),
		normals       = raw_data(normals),
		indices       = raw_data(indices),
		colors        = raw_data(colors),
	}
	fmt.println(i32(len(vertices) / 3))
	fmt.println(i32(len(indices) / 3))
	rl.UploadMesh(&mesh, false)
	return mesh
}

SAMPLE_RATE :: 44100
BUFFER_SIZE :: 512
FREQUENCY :: 440

fill_audio :: proc() {
	if rl.IsAudioStreamProcessed(g_mem.audio_stream) {
		fmt.println(rl.IsAudioStreamProcessed(g_mem.audio_stream))
		for i in 0 ..< BUFFER_SIZE {
			g_mem.audio_buffer[i] = math.sin(
				FREQUENCY * math.TAU * f32(i + int(g_mem.audio_frame)) / SAMPLE_RATE,
			)
		}
		rl.UpdateAudioStream(g_mem.audio_stream, raw_data(g_mem.audio_buffer[:]), BUFFER_SIZE)
		g_mem.audio_frame += BUFFER_SIZE
	}
}

audio_callback :: proc "c" (b: rawptr, frames: u32) {
	ptr: [^]f32 = cast([^]f32)(b)
	for i in 0 ..< frames {
		ptr[i] = math.sin(FREQUENCY * math.TAU * f32(i + g_mem.audio_frame) / SAMPLE_RATE)
	}
	g_mem.audio_frame += frames
}

@(export)
game_reload :: proc() {

	g_mem.audio_stream = rl.LoadAudioStream(SAMPLE_RATE, 32, 1)
	rl.SetAudioStreamCallback(g_mem.audio_stream, audio_callback)
	//rl.PlayAudioStream(g_mem.audio_stream)
	g_mem.audio_frame = 0

	//g_mem.graphics_memory.meshes["base"] = generate_mesh()
	restart()
	free_all(context.temp_allocator)
}


/* Allocates the GameMemory that we use to store
  our game's state. We assign it to a global
  variable so we can use it from the other
  procedures. */
@(export)
game_init_window :: proc() {
	restart()
}
/* Allocates the GameMemory that we use to store
	our game's state. We assign it to a global
	variable so we can use it from the other
	procedures. */
@(export)
game_shutdown_window :: proc() {
}

/* Simulation and rendering goes here. Return
  false when you wish to terminate the program. */
@(export)
game_update :: proc() -> bool {

	// game state
	cmd := game.tick(&g_mem.game_memory, &g_mem.graphics_memory)
	game.apply(&g_mem.game_memory, cmd)


	rl.BeginDrawing()
	rl.ClearBackground({76, 53, 83, 255})

	game.render(&g_mem.game_memory, &g_mem.graphics_memory)

	rl.EndDrawing()

	free_all(context.temp_allocator)
	return true
}

/* Called by the main program when the main loop
  has exited. Clean up your memory here. */
@(export)
game_shutdown :: proc() {
	rl.UnloadMaterial(g_mem.graphics_memory.materials["base"])
	rl.UnloadMesh(g_mem.graphics_memory.meshes["base"])

	free(g_mem)
	rl.CloseAudioDevice()
	rl.CloseWindow()
}

/* Returns a pointer to the game memory. When
  hot reloading, the main program needs a pointer
  to the game memory. It can then load a new game
  DLL and tell it to use the same memory by calling
  game_hot_reloaded on the new game DLL, supplying
  it the game memory pointer. */
@(export)
game_memory :: proc() -> rawptr {
	game_reload()
	return g_mem
}

/* Used to set the game memory pointer after a
  hot reload occurs. See game_memory comments. */
@(export)
game_hot_reloaded :: proc(mem: ^GameMemory) {
	g_mem = mem
	restart()
}
