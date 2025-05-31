package game

import "../graphics"
import "../gui"
import "core:fmt"
import "core:math"
import "core:slice"
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


GameEntity :: struct {
	id:       int,
	entity:   MySumType,
	selected: SelectionState,
	position: Vec2i,
	mesh:     string,
	material: string,
}


UIElement :: struct {
	id: int,
}

Button :: struct {
	using identifier: UIElement,
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
	score:          Score,
	lives:          int,
	entityId:       int,
	entities:       [dynamic]GameEntity,
	cube_transform: # row_major matrix[4, 4]f32,
	ui_memory:      UIState,
}

Command :: enum int {
	NONE    = 0,
	CLICKED = 1,
}

place_tower :: proc(state: ^GameState, pos: Vec2i) {

}

ground :: proc(pos: Vec2i) -> GameEntity {
	return GameEntity{}
}

entity :: proc(game: ^GameState) -> ^GameEntity {
	e := GameEntity{}
	append(&game.entities, e)
	return &game.entities[len(game.entities) - 1]
}


init :: proc() -> GameState {
	state := GameState{}
	for x in -10 ..< 11 {
		for y in -10 ..< 11 {
			g := entity(&state)
			g.entity = Ground{}
			g.position = Vec2i{x, y}
			g.material = "base"
			g.mesh = "base"
		}
	}
	return state
}

RayHit :: struct {
	index: int,
	hit:   rl.RayCollision,
}

tick :: proc(state: ^GameState, graphics_state: ^graphics.GraphicsState) -> Command {
	mp := rl.GetMousePosition()
	camera := rl.Camera3D {
		position = rl.Vector3{10, 10, 10},
		target   = rl.Vector3{0, 0, 0},
		up       = rl.Vector3{0, 1, 0},
		fovy     = 40,
	}
	ray := rl.GetScreenToWorldRay(mp, camera) // Get a ray trace from screen position (i.e mouse)

	rayHit := make([dynamic]RayHit)

	// find the ray hits
	for i in 0 ..< len(state.entities) {

		g := state.entities[i]
		transform_matrix := rl.MatrixTranslate(f32(g.position[0]), 0, f32(g.position[1]))

		collision := rl.GetRayCollisionMesh(ray, graphics_state.meshes[g.mesh], transform_matrix)

		if collision.hit {
			append(&rayHit, RayHit{hit = collision, index = i})
		}
	}

	slice.sort_by(
		rayHit[:],
		proc(a, b: RayHit) -> bool {
			return a.hit.distance > b.hit.distance // descending order
		},
	)


	for i in 0 ..< len(state.entities) {

		state.entities[i].selected = .INACTIVE

		if len(rayHit) > 0 && rayHit[len(rayHit) - 1].index == i {
			md := rl.IsMouseButtonDown(.LEFT)
			if md {
				state.entities[i].selected = .ACTIVE
			} else {
				state.entities[i].selected = .HOT

			}
		}
	}

	mp_2d := rl.GetMousePosition() * SCREEN_SIZE / f32(WINDOW_SIZE)
	md := rl.IsMouseButtonDown(.LEFT)
	over_button := rl.CheckCollisionPointRec(mp_2d, state.ui_memory.button.position)
	switch state.ui_memory.button.state {
	case .INACTIVE:
		if over_button {
			state.ui_memory.button.state = .HOT
		}
	case .HOT:
		if !over_button {
			state.ui_memory.button.state = .INACTIVE
		} else if md {
			state.ui_memory.button.state = .ACTIVE
		}
	case .ACTIVE:
		if !md {
			state.ui_memory.button.state = .INACTIVE
			if over_button {
				return .CLICKED
			}
		}
	}
	return .NONE
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

	for i in 0 ..< len(state.entities) {
		e := state.entities[i]
		switch entity in e.entity {
		case Ground:
		}
		switch e.selected {
		case .INACTIVE:
			rl.SetShaderValue(
				graphics_state.materials[e.material].shader,
				loc,
				raw_data([]f32{1, 1, 0, 1}),
				.VEC4,
			)
		case .HOT:
			rl.SetShaderValue(
				graphics_state.materials[e.material].shader,
				loc,
				raw_data([]f32{1, 0, 0, 1}),
				.VEC4,
			)
		case .ACTIVE:
			rl.SetShaderValue(
				graphics_state.materials[e.material].shader,
				loc,
				raw_data([]f32{0, 1, 0, 1}),
				.VEC4,
			)
		}
		transform_matrix := rl.MatrixTranslate(f32(e.position[0]), 0, f32(e.position[1]))
		rl.DrawMesh(
			graphics_state.meshes[e.mesh],
			graphics_state.materials[e.material],
			transform_matrix,
		)

	}


	rl.EndMode3D()

	rl.BeginMode2D(rl.Camera2D{zoom = f32(WINDOW_SIZE) / SCREEN_SIZE})

	button_color := rl.Color{200, 200, 200, 255}

	switch state.ui_memory.button.state {
	case .INACTIVE:
		button_color = rl.Color{200, 200, 200, 255}
	case .HOT:
		button_color = rl.Color{0, 200, 200, 255}
	case .ACTIVE:
		button_color = rl.Color{200, 0, 200, 255}
	}
	gui.render_button(gui.Button{color = button_color, position = state.ui_memory.button.position})

	text_val := fmt.ctprint(state.score.value)
	time_since_change := f32(rl.GetTime()) - state.score.last_changed
	font_size := math.max(14, 40 - 200 * time_since_change)
	gui.render_text_box(
		gui.TextBox{position = rl.Vector2{100, 100}, font_size = font_size, text_val = text_val},
	)

	rl.EndMode2D()
}
