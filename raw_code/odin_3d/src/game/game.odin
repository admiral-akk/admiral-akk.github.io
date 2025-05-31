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
}

// Mouse buttons
TargetState :: enum int {
	INACTIVE = 0,
	HOT      = 1,
	ACTIVE   = 2,
}

Tower :: struct {
	pos:    Vec2i,
	attack: int,
	range:  int,
}

Ground :: struct {
	pos: Vec2i,
}

SelectionState :: enum int {
	INACTIVE = 0,
	HOT      = 1,
	ACTIVE   = 2,
}


// Define a union type
MySumType :: union {
	Ground,
}

// Define a tag type to identify the type currently stored
MySumTypeTag :: enum {
	Ground,
}

TaggedMySumType :: struct {
	tag:   MySumTypeTag,
	value: MySumType,
}

GameEntity :: struct {
	id:     int,
	entity: TaggedMySumType,
}


UIElement :: struct {
	id: int,
}

Button :: struct {
	using identifier: UIElement,
	hot:              bool,
	active:           bool,
	text:             string,
	position:         rl.Rectangle,
	state:            SelectionState,
}

UIState :: struct {
	button: Button,
}

Score :: struct {
	value:        int,
	last_changed: f32,
}

GameState :: struct {
	selected:       int,
	score:          Score,
	lives:          int,
	ground:         [dynamic]Ground,
	enemies:        [dynamic]Enemy,
	towers:         [dynamic]Tower,
	cube_transform: # row_major matrix[4, 4]f32,
	ui_memory:      UIState,
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
			}
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

	state.selected = -1
	closest := f32(10000000.0)
	// find the closest, mark it as selected
	for i in 0 ..< len(state.ground) {

		g := state.ground[i]
		transform_matrix := rl.MatrixTranslate(f32(g.pos[0]), 0, f32(g.pos[1]))

		collision := rl.GetRayCollisionMesh(ray, graphics_state.meshes["base"], transform_matrix)

		if collision.hit && collision.distance < closest {
			state.selected = i
			closest = collision.distance
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
	loc := rl.GetShaderLocation(graphics_state.shaders["base"], "colDiffuse2")
	rl.SetShaderValue(graphics_state.shaders["base"], loc, raw_data([]f32{1, 0, 0, 1}), .VEC4)

	rl.BeginMode3D(camera_3d)
	rl.DrawMesh(
		graphics_state.meshes["base"],
		graphics_state.materials["base"],
		state.cube_transform,
	)


	for i in 0 ..< len(state.ground) {
		g := state.ground[i]
		if i == state.selected {
			if rl.IsMouseButtonDown(.LEFT) {

				rl.SetShaderValue(
					graphics_state.shaders["base"],
					loc,
					raw_data([]f32{0, 1, 0, 1}),
					.VEC4,
				)
			} else {
				rl.SetShaderValue(
					graphics_state.shaders["base"],
					loc,
					raw_data([]f32{1, 1, 0, 1}),
					.VEC4,
				)}
		} else {
			rl.SetShaderValue(
				graphics_state.shaders["base"],
				loc,
				raw_data([]f32{1, 0, 0, 1}),
				.VEC4,
			)

		}
		transform_matrix := rl.MatrixTranslate(f32(g.pos[0]), 0, f32(g.pos[1]))
		rl.DrawMesh(
			graphics_state.meshes["base"],
			graphics_state.materials["base"],
			transform_matrix,
		)
	}

	rl.EndMode3D()
}
