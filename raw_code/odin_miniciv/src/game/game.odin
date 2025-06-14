package game

import gfx "../graphics"
import "../sounds"
import "base:runtime"
import "core:fmt"
import "core:math"
import "core:math/rand"
import "core:slice"
import "core:strings"
import "gui"
import "oklab"
import rl "vendor:raylib"

WINDOW_SIZE :: 720
SCREEN_SIZE :: 320
TICK_RATE :: 0.02
GRID_SIZE :: 128
TOWER_ATTACK :: 1
TICK_TO_SPAWN :: 200
TOWER_RANGE :: 400
TOWER_RELOAD_TICKS :: 50
ENEMY_SPEED :: 5
GRAVITY_PER_TICK :: 0.1
ENEMY_HEALTH :: 2
PARTICLE_SCALE :: 0.2
PARTICLE_MAX_TICKS :: 40
Vec2i :: [2]int

// add some sound effects using the 8-bit midi sound effect thing where you draw them using notes

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
	attack:          int,
	reload_ticks:    int,
	last_fired_tick: GameTime,
	range:           int,
}

Enemy :: struct {
	health: int,
	speed:  int,
}

Town :: struct {
}

// follows a parabolic arc, stops at ground
Particle :: struct {
	start:       rl.Vector3,
	velocity:    rl.Vector3,
	created_at:  GameTime,
	clean_ticks: int,
}

Ray :: struct {
	created_at:  GameTime,
	clean_ticks: int,
	start:       rl.Vector3,
	end:         rl.Vector3,
}

ResourceClass :: enum {
	Person,
	Food,
}

ResourceDomain :: enum {
	Base,
}

Resource :: struct {
	class:  ResourceClass,
	domain: ResourceDomain,
}

Building :: struct {
	name:      string,
	input:     Resource,
	output:    Resource,
	inputIds:  [dynamic]int,
	outputIds: [dynamic]int,
}

EntityType :: union {
	Ground,
	Tower,
	Enemy,
	Town,
	Ray,
	Particle,
	Building,
}

GameEntity :: struct {
	id:       int,
	entity:   EntityType,
	selected: SelectionState,
	position: Vec2i,
	mesh:     string,
	material: string,
	renderer: Renderer,
}

ButtonType :: enum int {
	Increment = 0,
	NewGame   = 1,
}

Button :: struct {
	state: SelectionState,
	type:  ButtonType,
}

// elements that have persistent state
UIElement :: union {
	Button,
}

UIEntity :: struct {
	id:       int,
	element:  UIElement,
	selected: SelectionState,
	position: rl.Rectangle,
}

MeshRenderer :: struct {
	mesh:     string,
	material: string,
}

Renderer :: union {
	UIElement,
	MeshRenderer,
}

Score :: struct {
	value:        int,
	last_changed: GameTime,
}

GameTime :: struct {
	frame:     int,
	tick:      int,
	deltaTime: f32,
	realTime:  f64,
}

GameState :: enum int {
	PLAYING   = 0,
	GAME_OVER = 1,
}

Game :: struct {
	state:        GameState,
	time:         GameTime,
	score:        Score,
	lives:        int,
	audio_frame:  u32,
	audio_stream: rl.AudioStream,
	entityId:     int,
	entities:     [dynamic]GameEntity,
	ui_entities:  [dynamic]UIEntity,
	camera:       rl.Camera3D,
}

Command :: enum int {
	NONE    = 0,
	CLICKED = 1,
}

spawn_ray :: proc(game: ^Game, start: Vec2i, end: Vec2i) -> ^GameEntity {
	e := entity(game)
	e.entity = Ray {
		created_at  = game.time,
		clean_ticks = 20,
		start       = rl.Vector3{f32(start.x) / GRID_SIZE, 1, f32(start.y) / GRID_SIZE},
		end         = rl.Vector3{f32(end.x) / GRID_SIZE, 1, f32(end.y) / GRID_SIZE},
	}
	return e
}

entity :: proc(game: ^Game) -> ^GameEntity {
	e := GameEntity {
		renderer = MeshRenderer{material = "base", mesh = "base"},
		id = game.entityId,
	}
	game.entityId += 1
	append(&game.entities, e)
	return &game.entities[len(game.entities) - 1]
}

ui_e :: proc(game: ^Game) -> ^UIEntity {
	e := UIEntity {
		id = game.entityId,
	}
	game.entityId += 1

	append(&game.ui_entities, e)
	return &game.ui_entities[len(game.ui_entities) - 1]
}

delete_e :: proc(game: ^Game, entityId: int) {
	for i in 0 ..< len(game.entities) {
		if game.entities[i].id == entityId {
			unordered_remove(&game.entities, i)
			return
		}
	}
}
delete_ui :: proc(game: ^Game, entityId: int) {
	for i in 0 ..< len(game.ui_entities) {
		if game.ui_entities[i].id == entityId {
			unordered_remove(&game.ui_entities, i)
			return
		}
	}
}

makeGround :: proc(game: ^Game) {
	for x in -10 ..< 11 {
		for y in -10 ..< 11 {
			g := entity(game)
			g.entity = Ground{}
			g.position = Vec2i{x * GRID_SIZE, y * GRID_SIZE}
		}
	}
}

restart :: proc(game: ^Game) {
	for len(game.ui_entities) > 0 {
		delete_ui(game, game.ui_entities[0].id)
	}
	game.camera = rl.Camera3D {
		position   = rl.Vector3{10, 10, 10},
		target     = rl.Vector3{0, 0, 0},
		up         = rl.Vector3{0, 1, 0},
		fovy       = 30,
		projection = .ORTHOGRAPHIC,
	}
	game.state = .PLAYING
	game.lives = 10
	button := ui_e(game)
	button.position = rl.Rectangle{100, 240, 100, 50}
	button.element = Button {
		type = .Increment,
	}
	button2 := ui_e(game)
	button2.position = rl.Rectangle{200, 240, 200, 50}
	button2.element = Button {
		type = .Increment,
	}
	game.score.value = 0
	game.score.last_changed = game.time

	town := entity(game)
	town.entity = Town{}
}
newGame :: proc(game: ^Game) {
	for len(game.entities) > 0 {
		delete_e(game, game.entities[0].id)
	}
	makeGround(game)
	restart(game)
}

gameOver :: proc(game: ^Game) {
	game.state = .GAME_OVER

	for len(game.ui_entities) > 0 {
		delete_ui(game, game.ui_entities[0].id)
	}

	button := ui_e(game)
	button.position = rl.Rectangle{100, 240, 100, 50}
	button.element = Button {
		type = .NewGame,
	}
}

RayHit :: struct {
	id:  int,
	hit: rl.RayCollision,
}

place_tower :: proc(state: ^Game, pos: Vec2i) {
	#reverse for &e in state.entities {
		#partial switch entity in e.entity {
		case Tower:
			if (e.position == pos) {
				return
			}
		}
	}
	e := entity(state)
	e.position = pos
	e.entity = Tower {
		attack       = TOWER_ATTACK,
		reload_ticks = TOWER_RELOAD_TICKS,
		range        = TOWER_RANGE,
	}
	sounds.playSound("C", 0)

}

sign :: proc(v: Vec2i) -> Vec2i {
	x := 0
	y := 0
	if v.x > 0 {
		x = 1
	} else if v.x < 0 {
		x = -1
	}
	if v.y > 0 {
		y = 1
	} else if v.y < 0 {
		y = -1
	}
	return Vec2i{x, y}
}

length :: proc(v: Vec2i) -> int {
	return math.abs(v.x) + math.abs(v.y)
}

length_2 :: proc(v: Vec2i) -> int {
	return int(math.sqrt(f32(v.x * v.x + v.y * v.y)))
}

// 
find_nearest_enemy :: proc(state: ^Game, pos: Vec2i) -> Maybe(^GameEntity) {
	closest := -1
	ent: ^GameEntity
	distance := 100000
	for &e in state.entities {
		#partial switch &v in e.entity {
		case Enemy:
			new_dist := length_2(pos - e.position)
			if new_dist < distance {
				closest = e.id
				distance = new_dist
				ent = &e
			}
		}
	}
	if closest > -1 {
		return ent
	}
	return nil
}


// assumes we're trying to get to the closest town, gives the next
// target spot.
//
// assumes position is on the GRID, or in between two orthogonal points on 
// the grid.
//
// returns a direction with distance till you reach the next time you should check
path_find :: proc(state: ^Game, pos: Vec2i) -> (Vec2i, int) {
	// find the points on the grid we could move to, max of 4.

	nextPoints := make([dynamic]Vec2i)
	onY := math.abs(pos.y) % GRID_SIZE == 0
	onX := math.abs(pos.x) % GRID_SIZE == 0


	if onY && onX {
		// on a grid point, can move in all 4 orthogonal directions
		append(&nextPoints, Vec2i{pos.x + GRID_SIZE, pos.y})
		append(&nextPoints, Vec2i{pos.x - GRID_SIZE, pos.y})
		append(&nextPoints, Vec2i{pos.x, pos.y + GRID_SIZE})
		append(&nextPoints, Vec2i{pos.x, pos.y - GRID_SIZE})
	} else if onX {

		// truncates towards 0
		baseY := GRID_SIZE * (pos.y / GRID_SIZE)
		if pos.y < 0 {
			baseY -= GRID_SIZE
		}

		append(&nextPoints, Vec2i{pos.x, baseY + GRID_SIZE})
		append(&nextPoints, Vec2i{pos.x, baseY})

	} else if onY {
		// truncates towards 0
		baseX := GRID_SIZE * (pos.x / GRID_SIZE)
		if pos.x < 0 {
			baseX -= GRID_SIZE
		}

		append(&nextPoints, Vec2i{baseX + GRID_SIZE, pos.y})
		append(&nextPoints, Vec2i{baseX, pos.y})
	} else {
		// not on grid at all, grab the 4 quad around

		// truncates towards 0
		baseX := GRID_SIZE * (pos.x / GRID_SIZE)
		if pos.x < 0 {
			baseX -= GRID_SIZE
		}
		baseY := GRID_SIZE * (pos.y / GRID_SIZE)
		if pos.y < 0 {
			baseY -= GRID_SIZE
		}

		append(&nextPoints, Vec2i{baseX + GRID_SIZE, pos.y})
		append(&nextPoints, Vec2i{baseX, pos.y})
		append(&nextPoints, Vec2i{pos.x, baseY + GRID_SIZE})
		append(&nextPoints, Vec2i{pos.x, baseY})
	}

	// find the targets
	targets := make([dynamic]Vec2i)
	append(&targets, Vec2i{0, 0})

	// find the closest point to the targets
	closest := make([dynamic]int)
	append(&closest, 0)
	closest_dist :=
		math.abs(nextPoints[0].x - targets[0].x) + math.abs(nextPoints[0].y - targets[0].y)
	for i in 1 ..< len(nextPoints) {
		diff := math.abs(nextPoints[i].x - targets[0].x) + math.abs(nextPoints[i].y - targets[0].y)
		if diff < closest_dist {
			clear(&closest)
			append(&closest, i)
			closest_dist = diff
		} else if diff == closest_dist {
			append(&closest, i)
		}
	}

	// pick direction at random
	selected := nextPoints[rand.choice(closest[:])]
	dir_distance := selected - pos

	return sign(dir_distance), length(dir_distance)
}

spawn_enemy :: proc(state: ^Game, pos: Vec2i) {
	#reverse for &e in state.entities {
		#partial switch entity in e.entity {
		case Town:
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
		health = ENEMY_HEALTH,
		speed  = ENEMY_HEALTH,
	}
}

spawn_enemy_rand :: proc(state: ^Game) {
	pos := Vec2i{5 * GRID_SIZE, 5 * GRID_SIZE}
	spawn_enemy(state, pos)
}

apply :: proc(state: ^Game, command: Command) {
	switch command {
	case .NONE:
	case .CLICKED:
		state.score.value += 1
		state.score.last_changed = state.time
	}
}

get_ray_hits :: proc(state: ^Game) -> [dynamic]RayHit {
	mp := rl.GetMousePosition()
	ray := rl.GetScreenToWorldRay(mp, state.camera) // Get a ray trace from screen position (i.e mouse)
	rayHit := make([dynamic]RayHit)

	// find the ray hits
	for i in 0 ..< len(state.entities) {
		g := state.entities[i]
		#partial switch entity in g.entity {
		case Ground:
			transform_matrix := rl.MatrixTranslate(
				f32(g.position[0]) / GRID_SIZE,
				0,
				f32(g.position[1]) / GRID_SIZE,
			)
			#partial switch renderer in g.renderer {
			case MeshRenderer:
				collision := rl.GetRayCollisionMesh(
					ray,
					gfx.manager.meshes[renderer.mesh],
					transform_matrix,
				)

				if collision.hit {
					append(&rayHit, RayHit{hit = collision, id = g.id})
				}
			}
		}
	}
	slice.sort_by(
		rayHit[:],
		proc(a, b: RayHit) -> bool {
			return a.hit.distance > b.hit.distance // descending order
		},
	)
	return rayHit
}

update_time :: proc(state: ^Game) {
	state.time.frame += 1
	state.time.tick += 1
	state.time.deltaTime = rl.GetFrameTime()
	state.time.realTime = rl.GetTime()
}

ClickedOn :: union {
	UIElement,
}

spawn_particle :: proc(game: ^Game, pos: Vec2i) {
	e := entity(game)
	e.entity = Particle {
		start       = rl.Vector3{f32(pos.x) / GRID_SIZE, 1, f32(pos.y) / GRID_SIZE},
		velocity    = rl.Vector3 {
			rand.float32_range(-0.1, 0.1),
			rand.float32_range(-0.1, 0.4),
			rand.float32_range(-0.1, 0.1),
		},
		created_at  = game.time,
		clean_ticks = PARTICLE_MAX_TICKS,
	}
}

tick :: proc(state: ^Game) {
	update_time(state)

	switch state.state {
	case .GAME_OVER:
	case .PLAYING:
		if state.time.tick % TICK_TO_SPAWN == 0 {
			spawn_enemy_rand(state)
		}

		rayHit := get_ray_hits(state)


		for i in 0 ..< len(state.entities) {
			if len(rayHit) > 0 && rayHit[len(rayHit) - 1].id == state.entities[i].id {
				md := rl.IsMouseButtonDown(.LEFT)
				left_pressed := rl.IsMouseButtonPressed(.LEFT)
				left_released := rl.IsMouseButtonReleased(.LEFT)
				rmd := rl.IsMouseButtonDown(.RIGHT)
				switch state.entities[i].selected {
				case .INACTIVE:
					if left_pressed {
						state.entities[i].selected = .ACTIVE

					} else {
						state.entities[i].selected = .HOT
					}
				case .ACTIVE:
					if rmd {
						spawn_enemy(state, state.entities[i].position)
					}
					if left_released {
						state.entities[i].selected = .HOT
						place_tower(state, state.entities[i].position)
					}
				case .HOT:
					if left_pressed {
						state.entities[i].selected = .ACTIVE
					}
				}
			} else {
				state.entities[i].selected = .INACTIVE
			}
		}
		#reverse for &g in state.entities {
			#partial switch &tower in g.entity {
			case Tower:
				if state.time.tick - tower.last_fired_tick.tick >= tower.reload_ticks {
					nearest := find_nearest_enemy(state, g.position)
					#partial switch v in nearest {
					case ^GameEntity:
						#partial switch &enemy in v.entity {
						case Enemy:
							if length_2(v.position - g.position) <= tower.range {
								tower.last_fired_tick = state.time
								enemy.health -= tower.attack
								spawn_ray(state, g.position, v.position)
							}
						}
					}

				}
			}
		}


		#reverse for &g in state.entities {
			#partial switch &entity in g.entity {
			case Enemy:
				if entity.health <= 0 {

					for _ in 0 ..< 10 {
						spawn_particle(state, g.position)
					}
					delete_e(state, g.id)
				} else {
					remaining_dist := entity.speed

					for remaining_dist > 0 {
						if g.position == (Vec2i{0, 0}) {
							delete_e(state, g.id)
							state.lives -= 1
							if state.lives <= 0 {
								gameOver(state)
							}
							break
						}
						dir, dist := path_find(state, g.position)
						travel_dist := math.min(remaining_dist, dist)
						g.position += travel_dist * dir
						remaining_dist -= travel_dist

					}
				}
			case Ray:
				if entity.clean_ticks + entity.created_at.tick <= state.time.tick {
					delete_e(state, g.id)
				}

			case Particle:
				entity.start += entity.velocity
				entity.velocity.y -= GRAVITY_PER_TICK
				if entity.start.y < PARTICLE_SCALE + 0.5 {
					entity.start.y = PARTICLE_SCALE + 0.5
					entity.velocity.y = math.abs(entity.velocity.y)
					entity.velocity *= 0.5
					if rl.Vector3Length(entity.velocity) < 0.23 {
						entity.velocity *= 0
					}
				}
				if entity.clean_ticks + entity.created_at.tick <= state.time.tick {
					delete_e(state, g.id)
				}
			}
		}
	}

	mp_2d := rl.GetMousePosition() * SCREEN_SIZE / f32(WINDOW_SIZE)
	md := rl.IsMouseButtonDown(.LEFT)

	clickedOn := make([dynamic]ClickedOn)

	#reverse for &g in state.ui_entities {
		#partial switch &elem in g.element {
		case Button:
			over_button := rl.CheckCollisionPointRec(mp_2d, g.position)
			left_pressed := rl.IsMouseButtonPressed(.LEFT)
			left_released := rl.IsMouseButtonReleased(.LEFT)

			switch elem.state {
			case .INACTIVE:
				if over_button {
					if left_pressed {
						elem.state = .ACTIVE
					} else {
						elem.state = .HOT
					}
				}
			case .HOT:
				if !over_button {
					elem.state = .INACTIVE
				} else if left_pressed {
					elem.state = .ACTIVE
				}
			case .ACTIVE:
				if left_released {
					elem.state = .INACTIVE
					if over_button {
						append(&clickedOn, elem)
					}
				}
			}
		}
	}

	for c in clickedOn {
		switch v in c {
		case UIElement:
			{
				switch ui in v {
				case Button:
					switch ui.type {
					case .Increment:
						state.score.value += 1
						state.score.last_changed = state.time
					case .NewGame:
						newGame(state)
					}
				}

			}
		}
	}
}


render :: proc(state: ^Game) {
	// game state
	rl.BeginDrawing()
	rl.ClearBackground({76, 53, 83, 255})

	rl.BeginMode3D(state.camera)

	for i in 0 ..< len(state.entities) {
		e := state.entities[i]
		#partial switch renderer in e.renderer {
		case MeshRenderer:
			pos := [3]f32{f32(e.position[0]) / GRID_SIZE, 0, f32(e.position[1]) / GRID_SIZE}
			scale := [3]f32{1, 1, 1}

			rotation: rl.Vector3
			loc := rl.GetShaderLocation(
				gfx.manager.materials[renderer.material].shader,
				"colDiffuse2",
			)
			color := [4]f32{0, 0, 0, 0}
			#partial switch entity in e.entity {
			case Ground:
				color = oklab.color({0.2, 0.2, 0.45, 1.})
			case Tower:
				color = oklab.color({0.5, 0.5, 0.5, 1.})
				pos[1] = 1
				scale *= 0.8
			case Enemy:
				color = oklab.color({0.5, 0.5, 0.5, 1.})
				pos[1] = 1
				scale *= 0.8
			case Town:
				pos[1] = 1
				scale *= 0.8
				color = oklab.color({0.4, 0.4, 0.5, 1.})
			case Ray:
				pos = (entity.end + entity.start) / 2
				scale.x = rl.Vector3Length(entity.end - entity.start)
				scale.y = 0.1
				scale.z = 0.1
				rotation.y = math.atan2(
					entity.start.z - entity.end.z,
					entity.end.x - entity.start.x,
				)
				color = oklab.color(
					{
						0.4,
						0.4,
						0.5,
						1 -
						f32(state.time.tick - entity.created_at.tick) / f32(entity.clean_ticks),
					},
				)
			case Particle:
				pos = entity.start
				scale *= PARTICLE_SCALE
				color = oklab.color(
					{
						0.6,
						0.6,
						0.525,
						1 -
						f32(state.time.tick - entity.created_at.tick) / f32(entity.clean_ticks),
					},
				)
			}

			switch e.selected {
			case .INACTIVE:

			case .HOT:
				color[0] += 0.1
				color[1] += 0.1
			case .ACTIVE:
				color[0] += 0.2
				color[1] += 0.2
			}

			transform_matrix :=
				rl.MatrixTranslate(pos.x, pos.y, pos.z) *
				rl.MatrixRotateXYZ(rotation) *
				rl.MatrixScale(scale.x, scale.y, scale.z)

			rl.SetShaderValue(
				gfx.manager.materials[renderer.material].shader,
				loc,
				raw_data(color[:]),
				.VEC4,
			)
			rl.DrawMesh(
				gfx.manager.meshes[renderer.mesh],
				gfx.manager.materials[renderer.material],
				transform_matrix,
			)
		}
	}
	rl.EndMode3D()

	rl.BeginMode2D(rl.Camera2D{zoom = 1., offset = rl.Vector2{SCREEN_SIZE / 2, SCREEN_SIZE / 2}})

	for e in state.entities {
		#partial switch entity in e.entity {
		case Building:
			gui.render_text_box(
				gui.TextBox {
					position = rl.Vector2{f32(e.position.x), f32(e.position.y)},
					font_size = 14,
					text_val = strings.clone_to_cstring(entity.name, context.temp_allocator),
					color = oklab.OkLab{0.2, 0.2, 0.45, 1.},
				},
			)
		}

	}
	rl.EndMode2D()
	rl.BeginMode2D(rl.Camera2D{zoom = f32(WINDOW_SIZE) / SCREEN_SIZE})

	for e in state.ui_entities {
		switch elem in e.element {
		case Button:
			button_color := rl.Color{200, 200, 200, 255}

			switch elem.state {
			case .INACTIVE:
				button_color = rl.Color{200, 200, 200, 255}
			case .HOT:
				button_color = rl.Color{0, 200, 200, 255}
			case .ACTIVE:
				button_color = rl.Color{200, 0, 200, 255}
			}

			gui.render_button(gui.Button{color = button_color, position = e.position})
			switch elem.type {
			case .Increment:
				gui.render_text_box(
					gui.TextBox {
						position = rl.Vector2 {
							e.position.x + e.position.width / 2,
							e.position.y + e.position.height / 2,
						},
						font_size = 14,
						text_val = "Increment",
					},
				)
			case .NewGame:
				gui.render_text_box(
					gui.TextBox {
						position = rl.Vector2 {
							e.position.x + e.position.width / 2,
							e.position.y + e.position.height / 2,
						},
						font_size = 14,
						text_val = "New Game",
					},
				)
			}
		}
	}

	text_val := fmt.ctprint(state.score.value)
	frames_since_change := state.time.frame - state.score.last_changed.frame
	font_size := f32(math.max(14, 40 - 3 * frames_since_change))
	gui.render_text_box(
		gui.TextBox {
			position = rl.Vector2{220, 20},
			font_size = font_size,
			text_val = text_val,
			color = oklab.OkLab{1, 0, 0, 1},
		},
	)

	gui.render_text_box(
		gui.TextBox {
			position = rl.Vector2{20, 20},
			font_size = 20,
			text_val = fmt.ctprint(state.lives),
			color = oklab.OkLab{1, 0, 0, 1},
		},
	)

	rl.EndMode2D()
	rl.EndDrawing()
}

makeBuilding :: proc(game: ^Game) -> ^GameEntity {
	g := entity(game)
	g.entity = Building {
		name = "Village",
	}
	g.position = Vec2i{20, 20}
	return g
}

init :: proc() -> Game {
	state := Game{}

	makeBuilding(&state)
	makeGround(&state)
	// test deletion
	restart(&state)
	return state
}
