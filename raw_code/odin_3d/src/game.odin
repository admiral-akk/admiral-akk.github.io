package game

import "core:fmt"
import "core:math"
import rl "vendor:raylib"

WINDOW_SIZE :: 1280
SCREEN_SIZE :: 320
TICK_RATE :: 0.02

VERT_SHADER :: `#version 330                       
layout(location = 0)  in vec3 vertexPosition;            
layout(location = 1) in vec2 vertexTexCoord;    
layout(location = 2) in vec3 vertexNormal;         
layout(location = 3)  in vec4 vertexColor;         
layout(location = 4)  in vec4 vertexTangent;         
layout(location = 5) in vec2 vertexTexCoord2;              
out vec2 fragTexCoord;             
out vec4 fragColor;  

uniform mat4 mvp;                  
void main()                        
{                                  
    fragTexCoord = vertexTexCoord; 
    fragColor = vertexColor;       
    gl_Position = mvp*vec4(vertexPosition, 1.0); 
}                                  
	              `


FRAG_SHADER :: `#version 330       
in vec2 fragTexCoord;              
in vec4 fragColor;                 
out vec4 finalColor;               
uniform sampler2D texture0;        
uniform vec4 colDiffuse;           
void main()                        
{                                  
    vec4 texelColor = texture(texture0, fragTexCoord);   
    finalColor =  texelColor*colDiffuse*fragColor;        
}                                  
	`


/* Our game's state lives within this struct. In
order for hot reload to work the game's memory
must be transferable from one game DLL to
another when a hot reload occurs. We can do that
when all the game's memory live in here. */
GameMemory :: struct {
	tick_timer:     f32,
	cube_mesh:      rl.Mesh,
	cube_material:  rl.Material,
	audio_stream:   rl.AudioStream,
	audio_frame:    u32,
	audio_buffer:   [BUFFER_SIZE]f32,
	cube_transform: # row_major matrix[4, 4]f32,
	cube_shader:    rl.Shader,
}

g_mem: ^GameMemory

restart :: proc() {
	g_mem.cube_transform = rl.Matrix(1)
}

tick :: proc() {
	g_mem.tick_timer -= rl.GetFrameTime()
	if g_mem.tick_timer <= 0 {
		rotation := rl.MatrixRotate(rl.Vector3{0, 1, 0}, 0.1)
		g_mem.cube_transform = rotation * g_mem.cube_transform

		g_mem.tick_timer = TICK_RATE
	}
}


render :: proc() {
	rl.BeginDrawing()
	rl.ClearBackground({76, 53, 83, 255})

	camera_3d := rl.Camera3D {
		position = rl.Vector3{3, 3, 3},
		target   = rl.Vector3{0, 0, 0},
		up       = rl.Vector3{0, 1, 0},
		fovy     = 40,
	}

	rl.BeginMode3D(camera_3d)
	fill_audio()
	rl.DrawMesh(g_mem.cube_mesh, g_mem.cube_material, g_mem.cube_transform)

	rl.EndMode3D()
	rl.EndDrawing()
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
	restart()
}

generate_mesh :: proc() -> rl.Mesh {
	mesh := rl.Mesh {
		vertexCount   = 24,
		triangleCount = 12,
		vertices      = raw_data(
			[]f32 {
				-0.500,
				-0.500,
				0.500,
				0.500,
				-0.500,
				0.500,
				0.500,
				0.500,
				0.500,
				-0.500,
				0.500,
				0.500,
				-0.500,
				-0.500,
				-0.500,
				-0.500,
				0.500,
				-0.500,
				0.500,
				0.500,
				-0.500,
				0.500,
				-0.500,
				-0.500,
				-0.500,
				0.500,
				-0.500,
				-0.500,
				0.500,
				0.500,
				0.500,
				0.500,
				0.500,
				0.500,
				0.500,
				-0.500,
				-0.500,
				-0.500,
				-0.500,
				0.500,
				-0.500,
				-0.500,
				0.500,
				-0.500,
				0.500,
				-0.500,
				-0.500,
				0.500,
				0.500,
				-0.500,
				-0.500,
				0.500,
				0.500,
				-0.500,
				0.500,
				0.500,
				0.500,
				0.500,
				-0.500,
				0.500,
				-0.500,
				-0.500,
				-0.500,
				-0.500,
				-0.500,
				0.500,
				-0.500,
				0.500,
				0.500,
				-0.500,
				0.500,
				-0.500,
			},
		),
		texcoords     = raw_data(
			[]f32 {
				0.000,
				0.000,
				1.000,
				0.000,
				1.000,
				1.000,
				0.000,
				1.000,
				1.000,
				0.000,
				1.000,
				1.000,
				0.000,
				1.000,
				0.000,
				0.000,
				0.000,
				1.000,
				0.000,
				0.000,
				1.000,
				0.000,
				1.000,
				1.000,
				1.000,
				1.000,
				0.000,
				1.000,
				0.000,
				0.000,
				1.000,
				0.000,
				1.000,
				0.000,
				1.000,
				1.000,
				0.000,
				1.000,
				0.000,
				0.000,
				0.000,
				0.000,
				1.000,
				0.000,
				1.000,
				1.000,
				0.000,
				1.000,
			},
		),
		normals       = raw_data(
			[]f32 {
				0.000,
				0.000,
				1.000,
				0.000,
				0.000,
				1.000,
				0.000,
				0.000,
				1.000,
				0.000,
				0.000,
				1.000,
				0.000,
				0.000,
				-1.000,
				0.000,
				0.000,
				-1.000,
				0.000,
				0.000,
				-1.000,
				0.000,
				0.000,
				-1.000,
				0.000,
				1.000,
				0.000,
				0.000,
				1.000,
				0.000,
				0.000,
				1.000,
				0.000,
				0.000,
				1.000,
				0.000,
				0.000,
				-1.000,
				0.000,
				0.000,
				-1.000,
				0.000,
				0.000,
				-1.000,
				0.000,
				0.000,
				-1.000,
				0.000,
				1.000,
				0.000,
				0.000,
				1.000,
				0.000,
				0.000,
				1.000,
				0.000,
				0.000,
				1.000,
				0.000,
				0.000,
				-1.000,
				0.000,
				0.000,
				-1.000,
				0.000,
				0.000,
				-1.000,
				0.000,
				0.000,
				-1.000,
				0.000,
				0.000,
			},
		),
		indices       = raw_data(
			[]u16 {
				0,
				1,
				2,
				0,
				2,
				3,
				4,
				5,
				6,
				4,
				6,
				7,
				8,
				9,
				10,
				8,
				10,
				11,
				12,
				13,
				14,
				12,
				14,
				15,
				16,
				17,
				18,
				16,
				18,
				19,
				20,
				21,
				22,
				20,
				22,
				23,
			},
		),
	}
	rl.UploadMesh(&mesh, false)
	return mesh
}

SAMPLE_RATE :: 44100
BUFFER_SIZE :: 512
FREQUENCY :: 440

fill_audio :: proc() {fmt.println(rl.IsAudioStreamProcessed(g_mem.audio_stream))
	if rl.IsAudioStreamProcessed(g_mem.audio_stream) {
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
	g_mem.cube_material = rl.LoadMaterialDefault()
	g_mem.cube_material.shader = rl.LoadShaderFromMemory(VERT_SHADER, FRAG_SHADER)
	g_mem.audio_stream = rl.LoadAudioStream(SAMPLE_RATE, 32, 1)
	rl.SetAudioStreamCallback(g_mem.audio_stream, audio_callback)
	rl.PlayAudioStream(g_mem.audio_stream)
	g_mem.audio_frame = 0

	//g_mem.cube_mesh = generate_mesh()
	g_mem.cube_mesh = rl.GenMeshCube(1, 1, 1)

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
	tick()
	render()
	free_all(context.temp_allocator)
	return true
}

/* Called by the main program when the main loop
  has exited. Clean up your memory here. */
@(export)
game_shutdown :: proc() {
	rl.UnloadMaterial(g_mem.cube_material)
	rl.UnloadMesh(g_mem.cube_mesh)

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
}
