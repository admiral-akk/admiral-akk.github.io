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

// Mouse buttons
TargetState :: enum int {
	INACTIVE = 0,
	HOT      = 1,
	ACTIVE   = 2,
}

Ground :: struct {
}

SelectionState :: enum int {
	INACTIVE = 0,
	HOT      = 1,
	ACTIVE   = 2,
}


Tower :: struct {
	attack: int,
	range:  int,
}

Enemy :: struct {
	health: int,
	speed:  int,
}

// Define a union type
MySumType :: union {
	Ground,
	Tower,
	Enemy,
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
	score:     Score,
	lives:     int,
	entityId:  int,
	entities:  [dynamic]GameEntity,
	ui_memory: UIState,
}

Command :: enum int {
	NONE    = 0,
	CLICKED = 1,
}


entity :: proc(game: ^GameState) -> ^GameEntity {
	e := GameEntity {
		material = "base",
		mesh     = "base",
		id       = game.entityId,
	}
	game.entityId += 1
	append(&game.entities, e)
	return &game.entities[len(game.entities) - 1]
}

delete_e :: proc(game: ^GameState, entityId: int) {
	for i in 0 ..< len(game.entities) {
		if game.entities[i].id == entityId {
			unordered_remove(&game.entities, i)
			return
		}
	}
}

GRID_SIZE :: 128

init :: proc() -> GameState {
	state := GameState{}
	for x in -10 ..< 11 {
		for y in -10 ..< 11 {
			g := entity(&state)
			g.entity = Ground{}
			g.position = Vec2i{x * GRID_SIZE, y * GRID_SIZE}
		}
	}
	return state
}

RayHit :: struct {
	id:  int,
	hit: rl.RayCollision,
}

place_tower :: proc(state: ^GameState, pos: Vec2i) {
	for i in 0 ..< len(state.entities) {
		e := state.entities[i]
		switch entity in e.entity {
		case Ground:
		case Enemy:
		case Tower:
			if (e.position == pos) {
				return
			}
		}
	}
	e := entity(state)
	e.position = pos
	e.entity = Tower {
		attack = 1,
		range  = 1,
	}
}

spawn_enemy :: proc(state: ^GameState, pos: Vec2i) {
	for i in 0 ..< len(state.entities) {
		e := state.entities[i]
		switch entity in e.entity {
		case Ground:
		case Enemy:
			if (e.position == pos) {
				return
			}
		case Tower:
			if (e.position == pos) {
				return
			}
		}
	}
	e := entity(state)
	e.position = pos
	e.entity = Enemy {
		health = 1,
		speed  = 1,
	}

}

restart :: proc(game: ^GameState) {
	game.ui_memory.button.position = rl.Rectangle{100, 240, 100, 50}
	game.score.value = 0
	game.score.last_changed = 0.0
}

apply :: proc(state: ^GameState, command: Command) {
	switch command {
	case .NONE:
	case .CLICKED:
		state.score.value += 1
		state.score.last_changed = f32(rl.GetTime())
	}
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
		switch entity in g.entity {
		case Ground:
			transform_matrix := rl.MatrixTranslate(
				f32(g.position[0]) / GRID_SIZE,
				0,
				f32(g.position[1]) / GRID_SIZE,
			)

			collision := rl.GetRayCollisionMesh(
				ray,
				graphics_state.meshes[g.mesh],
				transform_matrix,
			)

			if collision.hit {
				append(&rayHit, RayHit{hit = collision, id = g.id})
			}
		case Tower:
		case Enemy:
		}
	}

	slice.sort_by(
		rayHit[:],
		proc(a, b: RayHit) -> bool {
			return a.hit.distance > b.hit.distance // descending order
		},
	)


	for i in 0 ..< len(state.entities) {
		if len(rayHit) > 0 && rayHit[len(rayHit) - 1].id == state.entities[i].id {
			md := rl.IsMouseButtonDown(.LEFT)
			rmd := rl.IsMouseButtonDown(.RIGHT)
			switch state.entities[i].selected {
			case .INACTIVE:
				if md {
					state.entities[i].selected = .ACTIVE
				} else {
					state.entities[i].selected = .HOT
				}
			case .ACTIVE:
				if rmd {
					spawn_enemy(state, state.entities[i].position)
				}
				if !md {
					state.entities[i].selected = .HOT
					place_tower(state, state.entities[i].position)
				}
			case .HOT:
				if md {
					state.entities[i].selected = .ACTIVE
				}
			}
		} else {
			state.entities[i].selected = .INACTIVE
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

	rl.BeginMode3D(camera_3d)

	for i in 0 ..< len(state.entities) {
		e := state.entities[i]
		transform_matrix := rl.MatrixTranslate(
			f32(e.position[0]) / GRID_SIZE,
			0,
			f32(e.position[1]) / GRID_SIZE,
		)
		loc := rl.GetShaderLocation(graphics_state.materials[e.material].shader, "colDiffuse2")
		switch entity in e.entity {
		case Ground:
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
		case Tower:
			transform_matrix =
				rl.MatrixTranslate(
					f32(e.position[0]) / GRID_SIZE,
					1,
					f32(e.position[1]) / GRID_SIZE,
				) *
				rl.MatrixScale(0.8, 0.8, 0.8)
			rl.SetShaderValue(
				graphics_state.materials[e.material].shader,
				loc,
				raw_data([]f32{1, 0, 1, 1}),
				.VEC4,
			)
		case Enemy:
			transform_matrix =
				rl.MatrixTranslate(
					f32(e.position[0]) / GRID_SIZE,
					1,
					f32(e.position[1]) / GRID_SIZE,
				) *
				rl.MatrixScale(0.8, 0.8, 0.8)
			rl.SetShaderValue(
				graphics_state.materials[e.material].shader,
				loc,
				raw_data([]f32{1, 0.5, 0.5, 1}),
				.VEC4,
			)
		}
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
