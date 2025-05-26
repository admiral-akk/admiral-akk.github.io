package reload

import "core:fmt"
import "core:math"
import "gui"
import rl "vendor:raylib"

WINDOW_SIZE :: 720
SCREEN_SIZE :: 320
TICK_RATE :: 0.02

VERT_SHADER :: `#version 330                       
layout(location = 0)  in vec3 vertexPosition;            
layout(location = 1) in vec2 vertexTexCoord;    
layout(location = 2) in vec3 vertexNormal;         
layout(location = 3)  in vec4 vertexColor;         
layout(location = 4)  in vec4 vertexTangent;         
layout(location = 5) in vec2 vertexTexCoord2;     
uniform sampler2D sTex;         
out vec2 fragTexCoord;             
out vec4 fragColor;  

uniform mat4 mvp;                  
void main()                        
{                                  
    fragTexCoord = vertexTexCoord; 
    fragColor = texture(sTex, vertexTexCoord);   
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
    vec4 texelColor = texture(texture0, step(1.0, fragTexCoord));   
    finalColor =  texelColor;        
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
	ui_memory:      gui.UIMemory,
	score:          int,
	score_size:     f32,
	current:        gui.Command,
	texture:        rl.Texture2D,
}

g_mem: ^GameMemory

restart :: proc() {
	g_mem.cube_transform = rl.Matrix(1)
	g_mem.ui_memory.button.position = rl.Rectangle{100, 240, 100, 50}
	g_mem.score = 0
	g_mem.score_size = 20
	image := rl.GenImageGradientLinear(128, 128, 0, {255, 0, 0, 255}, {0, 0, 0, 255})
	g_mem.texture = rl.LoadTextureFromImage(image)
	rl.GenTextureMipmaps(&g_mem.texture)
	rl.SetShaderValueTexture(g_mem.cube_material.shader, 0, g_mem.texture) // Set shader uniform value for texture (sampler2d)
	g_mem.cube_material.maps[0].texture = g_mem.texture
}

tick :: proc() {
	// game state
	g_mem.tick_timer -= rl.GetFrameTime()
	if g_mem.tick_timer <= 0 {
		rotation := rl.MatrixRotate(rl.Vector3{0, 1, 0}, math.PI * 1.5 / 2.0)
		g_mem.cube_transform = rotation
		g_mem.tick_timer = TICK_RATE
		if g_mem.score_size > 14 {
			g_mem.score_size -= TICK_RATE * 275
			g_mem.score_size = math.max(14, g_mem.score_size)
		}
	}

	// gui state 
	mp := rl.GetMousePosition() * SCREEN_SIZE / f32(WINDOW_SIZE)
	md := rl.IsMouseButtonDown(.LEFT)
	over_button := rl.CheckCollisionPointRec(mp, g_mem.ui_memory.button.position)


	switch g_mem.ui_memory.button.state {
	case .INACTIVE:
		if over_button {
			g_mem.ui_memory.button.state = .HOT
		}
	case .HOT:
		if !over_button {
			g_mem.ui_memory.button.state = .INACTIVE
		} else if md {
			g_mem.ui_memory.button.state = .ACTIVE
		}
	case .ACTIVE:
		if !md {
			g_mem.ui_memory.button.state = .INACTIVE
			if over_button {
				g_mem.current = .CLICKED
			}
		}
	}

	// apply command 

	switch g_mem.current {
	case .NONE:
	case .CLICKED:
		g_mem.score += 1
		g_mem.score_size = 40
	}
	g_mem.current = .NONE
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


	rl.BeginMode2D(rl.Camera2D{zoom = f32(WINDOW_SIZE) / SCREEN_SIZE})
	//mp := rl.GetMousePosition() * SCREEN_SIZE / f32(WINDOW_SIZE)

	button_color := rl.Color{200, 200, 200, 255}


	switch g_mem.ui_memory.button.state {
	case .INACTIVE:
		button_color = rl.Color{200, 200, 200, 255}
	case .HOT:
		button_color = rl.Color{0, 200, 200, 255}
	case .ACTIVE:
		button_color = rl.Color{200, 0, 200, 255}
	}
	rl.DrawRectangleRec(g_mem.ui_memory.button.position, button_color)
	rl.DrawRectangleLinesEx(g_mem.ui_memory.button.position, 1, {50, 50, 50, 255})

	score := fmt.ctprint(g_mem.score)
	size := rl.MeasureTextEx(rl.GetFontDefault(), score, f32(g_mem.score_size), 0)
	rl.DrawText(
		score,
		100 - i32(size.x / 2),
		100 - i32(size.y / 2),
		i32(g_mem.score_size),
		{240, 240, 240, 255},
	)
	//fmt.println(mp)

	rl.EndMode2D()
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
	g_mem.cube_material = rl.LoadMaterialDefault()
	g_mem.cube_material.shader = rl.LoadShaderFromMemory(VERT_SHADER, FRAG_SHADER)

	g_mem.audio_stream = rl.LoadAudioStream(SAMPLE_RATE, 32, 1)
	rl.SetAudioStreamCallback(g_mem.audio_stream, audio_callback)
	//rl.PlayAudioStream(g_mem.audio_stream)
	g_mem.audio_frame = 0

	g_mem.cube_mesh = generate_mesh()
	//g_mem.cube_mesh = rl.GenMeshCube(1, 1, 1)
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
	restart()
}
