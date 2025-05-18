package game

import rl "vendor:raylib"

WINDOW_SIZE :: 1280
SCREEN_SIZE :: 320
TICK_RATE :: 0.02

VERT_SHADER :: `#version 330                       
in vec3 vertexPosition;            
in vec2 vertexTexCoord;            
in vec4 vertexColor;               
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
    finalColor = vec4(0.4);// texelColor*colDiffuse*fragColor;        
}                                  
	`


generate_box :: proc() -> rl.Mesh {
	vertexCount := i32(6 * 6)
	triangleCount := i32(6 * 2)
	vertices := [?]f32{1}
	colors := [?]u8{1}
	indices := [?]u16{1}
	texcoords := [?]f32{1}
	texcoords2 := [?]f32{1}
	normals := [?]f32{1}
	tangents := [?]f32{1}
	animVertices := [?]f32{1}
	animNormals := [?]f32{1}
	boneIds := [?]u8{1}
	boneWeights := [?]f32{}
	boneMatrices := [?](# row_major matrix[4, 4]f32){}
	boneCount := i32(1)
	vaoId := u32(1)
	vboId := [?]u32{1}

	return rl.Mesh {
		vertexCount   = vertexCount,
		// Number of vertices stored in arrays
		triangleCount = triangleCount,
		// Default vertex data
		vertices      = raw_data(vertices[:]),
		// Vertex position (XYZ - 3 components per vertex) (shader-location = 0)
		texcoords     = raw_data(texcoords[:]),
		// Vertex texture coordinates (UV - 2 components per vertex) (shader-location = 1)
		texcoords2    = raw_data(texcoords2[:]),
		// Vertex second texture coordinates (useful for lightmaps) (shader-location = 5)
		normals       = raw_data(normals[:]),
		// Vertex normals (XYZ - 3 components per vertex) (shader-location = 2)
		tangents      = raw_data(tangents[:]),
		// Vertex tangents (XYZW - 4 components per vertex) (shader-location = 4)
		colors        = raw_data(colors[:]),
		// Vertex colors (RGBA - 4 components per vertex) (shader-location = 3)
		indices       = raw_data(indices[:]),
		// Animation vertex data
		animVertices  = raw_data(animVertices[:]),
		// Animated vertex positions (after bones transformations)
		animNormals   = raw_data(animNormals[:]),
		// Animated normals (after bones transformations)
		boneIds       = raw_data(boneIds[:]),
		// Vertex bone ids, up to 4 bones influence by vertex (skinning)
		boneWeights   = raw_data(boneWeights[:]),
		// Vertex bone weight, up to 4 bones influence by vertex (skinning)
		boneMatrices  = raw_data(boneMatrices[:]),
		// Bones animated transformation matrices
		boneCount     = boneCount,
		// OpenGL identifiers
		vaoId         = vaoId,
		// OpenGL Vertex Array Object id
		vboId         = raw_data(vboId[:]),
	}
}

/* Our game's state lives within this struct. In
order for hot reload to work the game's memory
must be transferable from one game DLL to
another when a hot reload occurs. We can do that
when all the game's memory live in here. */
GameMemory :: struct {
	tick_timer:     f32,
	cube_mesh:      rl.Mesh,
	cube_material:  rl.Material,
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
		fovy     = 60,
	}

	rl.BeginMode3D(camera_3d)
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

@(export)
game_reload :: proc() {
	g_mem.cube_material = rl.LoadMaterialDefault()
	g_mem.cube_material.shader = rl.LoadShaderFromMemory(VERT_SHADER, FRAG_SHADER)
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
