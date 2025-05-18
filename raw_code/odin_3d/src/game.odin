package game

import "core:fmt"
import "core:math"
import "core:math/linalg"
import "core:math/rand"
import rl "vendor:raylib"

WINDOW_SIZE :: 1280
SCREEN_SIZE :: 320
Vec2i :: [2]int
TICK_RATE :: 0.02

PADDLE_WIDTH :: 50
PADDLE_HEIGHT :: 6
PADDLE_POS_Y :: 260
PADDLE_SPEED :: 200

BALL_SPEED :: 200
BALL_RADIUS :: 4
BALL_START_Y :: 160


NUM_BLOCKS_X :: 10
NUM_BLOCKS_Y :: 8

BLOCK_WIDTH :: 28
BLOCK_X_PADDING :: 20
BLOCK_HEIGHT :: 10
BLOCK_Y_PADDING :: 40


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

block_color_score := [Block_Color]int {
	.Yellow = 2,
	.Green  = 4,
	.Orange = 6,
	.Red    = 8,
}

Block_Color :: enum {
	Yellow,
	Green,
	Orange,
	Red,
}

row_colors := [NUM_BLOCKS_Y]Block_Color {
	.Red,
	.Red,
	.Orange,
	.Orange,
	.Green,
	.Green,
	.Yellow,
	.Yellow,
}

block_color_values := [Block_Color]rl.Color {
	.Yellow = {253, 249, 150, 255},
	.Green  = {180, 245, 190, 255},
	.Orange = {170, 120, 250, 255},
	.Red    = {250, 90, 85, 255},
}

/* Our game's state lives within this struct. In
order for hot reload to work the game's memory
must be transferable from one game DLL to
another when a hot reload occurs. We can do that
when all the game's memory live in here. */
GameMemory :: struct {
	some_state:           int,
	ball_texture:         rl.Texture2D,
	paddle_texture:       rl.Texture2D,
	hit_block_sound:      rl.Sound,
	hit_paddle_sound:     rl.Sound,
	game_over_sound:      rl.Sound,
	blocks:               [NUM_BLOCKS_X][NUM_BLOCKS_Y]bool,
	score:                int,
	start_time_offset:    f64,
	game_over:            bool,
	started:              bool,
	ball_pos:             rl.Vector2,
	ball_dir:             rl.Vector2,
	tick_timer:           f32,
	paddle_pos_x:         f32,
	paddle_move_velocity: f32,
	cube_mesh:            rl.Mesh,
	cube_material:        rl.Material,
	cube_transform:       # row_major matrix[4, 4]f32,
}

g_mem: ^GameMemory


restart :: proc() {
	g_mem.paddle_pos_x = 0.5 * (SCREEN_SIZE - PADDLE_WIDTH)
	g_mem.ball_pos = {0.5 * SCREEN_SIZE, BALL_START_Y}
	g_mem.ball_dir = {0, 0}
	g_mem.start_time_offset = rl.GetTime()
	g_mem.started = false
	g_mem.score = 0
	g_mem.game_over = false

	for x in 0 ..< NUM_BLOCKS_X {
		for y in 0 ..< NUM_BLOCKS_Y {
			g_mem.blocks[x][y] = true
		}
	}
}

calc_block_rect :: proc(x, y: int) -> rl.Rectangle {
	return {
		f32(BLOCK_X_PADDING + x * BLOCK_WIDTH),
		f32(BLOCK_Y_PADDING + y * BLOCK_HEIGHT),
		BLOCK_WIDTH,
		BLOCK_HEIGHT,
	}

}

reflect :: proc(dir, normal: rl.Vector2) -> rl.Vector2 {

	return linalg.normalize(linalg.reflect(dir, normal))
}

block_exists :: proc(x, y: int) -> bool {
	return x >= 0 && y >= 0 && x < NUM_BLOCKS_X && y < NUM_BLOCKS_Y && g_mem.blocks[x][y]
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
loop :: proc() {


	for !rl.WindowShouldClose() {
		tick()
		render()
		free_all(context.temp_allocator)
	}

	rl.UnloadSound(g_mem.hit_block_sound)
	rl.UnloadSound(g_mem.hit_paddle_sound)
	rl.UnloadSound(g_mem.game_over_sound)

	rl.UnloadTexture(g_mem.ball_texture)
	rl.UnloadTexture(g_mem.paddle_texture)

	rl.CloseAudioDevice()
	rl.CloseWindow()
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
	g_mem.cube_material = rl.LoadMaterialDefault()
	g_mem.cube_mesh = rl.GenMeshCube(1, 1, 1)
	g_mem.cube_transform = rl.Matrix(1)

	g_mem.ball_texture = rl.LoadTexture("assets/ball.png")
	g_mem.paddle_texture = rl.LoadTexture("assets/paddle.png")

	g_mem.hit_block_sound = rl.LoadSound("assets/hit_block.wav")
	g_mem.hit_paddle_sound = rl.LoadSound("assets/hit_paddle.wav")
	g_mem.game_over_sound = rl.LoadSound("assets/game_over.wav")
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
	free(g_mem)
	rl.UnloadSound(g_mem.hit_block_sound)
	rl.UnloadSound(g_mem.hit_paddle_sound)
	rl.UnloadSound(g_mem.game_over_sound)

	rl.UnloadTexture(g_mem.ball_texture)
	rl.UnloadTexture(g_mem.paddle_texture)

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
	return g_mem
}

/* Used to set the game memory pointer after a
  hot reload occurs. See game_memory comments. */
@(export)
game_hot_reloaded :: proc(mem: ^GameMemory) {
	g_mem = mem
}
