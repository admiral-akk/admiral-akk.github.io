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

place_tower :: proc(state: ^GameState, pos: Vec2i) {

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
		position = rl.Vector3{10, 10, 10},
		target   = rl.Vector3{0, 0, 0},
		up       = rl.Vector3{0, 1, 0},
		fovy     = 40,
	}
	ray := rl.GetScreenToWorldRay(mp, camera) // Get a ray trace from screen position (i.e mouse)

	for i in 0 ..< len(state.ground) {

		collision := rl.GetRayCollisionMesh(
			ray,
			graphics_state.meshes[state.ground[i].render.mesh_id],
			state.ground[i].render.transform_matrix,
		)


		if collision.hit {
			md := rl.IsMouseButtonDown(.LEFT)
			if md {

				fmt.println(collision)
			}
		}
	}
}


render :: proc(state: ^GameState, graphics_state: ^graphics.GraphicsState) {


	camera_3d := rl.Camera3D {
		position = rl.Vector3{10, 10, 10},
		target   = rl.Vector3{0, 0, 0},
		up       = rl.Vector3{0, 1, 0},
		fovy     = 40,
	}

	rl.BeginMode3D(camera_3d)
	rl.DrawMesh(
		graphics_state.meshes["base"],
		graphics_state.materials["base"],
		state.cube_transform,
	)

	for i in 0 ..< len(state.ground) {
		renderable := state.ground[i].render

		rl.DrawMesh(
			graphics_state.meshes[renderable.mesh_id],
			graphics_state.materials[renderable.material_id],
			renderable.transform_matrix,
		)
	}

	rl.EndMode3D()
}
