package game

import "../graphics"
import "core:fmt"
import rl "vendor:raylib"
WINDOW_SIZE :: 720
SCREEN_SIZE :: 320
TICK_RATE :: 0.02
Vec2i :: [2]int

Enemy :: struct {
	pos:    Vec2i,
	health: int,
	speed:  int,
	render: Renderable,
}

Tower :: struct {
	pos:    Vec2i,
	attack: int,
	range:  int,
	render: Renderable,
}

Ground :: struct {
	pos:    Vec2i,
	render: Renderable,
}

Renderable :: struct {
	position:         rl.Vector3,
	rotation:         rl.Quaternion,
	scale:            rl.Vector3,
	transform_matrix: # row_major matrix[4, 4]f32,
	mesh_id:          string,
	material_id:      string,
}

GameState :: struct {
	score:          int,
	lives:          int,
	ground:         [dynamic]Ground,
	enemies:        [dynamic]Enemy,
	towers:         [dynamic]Tower,
	cube_transform: # row_major matrix[4, 4]f32,
}

Command :: enum int {
	NONE    = 0,
	CLICKED = 1,
}

init :: proc() -> GameState {
	state := GameState{}
	for x in -10 ..< 11 {
		for y in -10 ..< 11 {
			g := Ground {
				pos = Vec2i{x, y},
				render = Renderable {
					position = rl.Vector3{f32(x), 0, f32(y)},
					rotation = rl.Quaternion{},
					scale = rl.Vector3{1, 1, 1},
					transform_matrix = rl.Matrix(1),
					mesh_id = "base",
					material_id = "base",
				},
			}
			g.render.transform_matrix =
				rl.MatrixTranslate(f32(x), 0, f32(y)) *
				rl.QuaternionToMatrix(g.render.rotation) *
				rl.MatrixScale(0.4, 0.4, 0.4)
			append(&state.ground, g)
		}
	}
	return state
}

tick :: proc(state: ^GameState, graphics_state: ^graphics.GraphicsState) {
	mp := rl.GetMousePosition()
	camera := rl.Camera3D {
		position = rl.Vector3{3, 3, 3},
		target   = rl.Vector3{0, 0, 0},
		up       = rl.Vector3{0, 1, 0},
		fovy     = 40,
	}
	ray := rl.GetScreenToWorldRay(mp, camera) // Get a ray trace from screen position (i.e mouse)
	collision := rl.GetRayCollisionMesh(ray, graphics_state.meshes["base"], state.cube_transform)


	if collision.hit {
		fmt.println(collision)
	}
}
