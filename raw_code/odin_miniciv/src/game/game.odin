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

Upgrade :: struct {
	name:     string,
	requires: [dynamic]Resource,
}

Blueprint :: struct {
	name:   string,
	input:  [dynamic]Resource,
	output: [dynamic]Resource,
}

Building :: struct {
	name:      string,
	upgrade:   Maybe(Upgrade),
	triggers:  [dynamic]Trigger,
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
	UIEntity,
	MeshRenderer,
}

// Represents having access to a resource
//
// Ticks downwards without resource, and upwards with resource.
//
// Condition is met iff current == target.
//
// current = math.clamp(current, math)
Fill :: struct {
	resource: Resource,
	current:  int,
	target:   int,
	min:      int,
	max:      int,
}

Drain :: struct {
	resource: Resource,
	current:  int,
	target:   int,
	min:      int,
	max:      int,
}

Condition :: union {
	Fill,
	Drain,
}

ReplaceLocation :: struct {
	// nil means that the location is removed
	name: Maybe(string),
}

Result :: union {
	ReplaceLocation,
}

// something like:
//
// if X holds, then Y happens
// 
// can use this to power _everything_
Trigger :: struct {
	conditions: Condition,
	results:    Result,
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
	camera2d:     rl.Camera2D,
	blueprints:   map[string]Blueprint,
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

e_get :: proc(game: ^Game, id: int) -> ^GameEntity {
	for i in 0 ..< len(game.entities) {
		if game.entities[i].id == id {
			return &game.entities[i]
		}
	}

	return nil
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

	game.camera2d = rl.Camera2D {
		offset = rl.Vector2{WINDOW_SIZE / 2, WINDOW_SIZE / 2},
		zoom   = 1,
	}

	game.state = .PLAYING
	game.lives = 10
	button := ui_e(game)
	button.position = rl.Rectangle{100, 240, 100, 50}
	button.element = Button {
		type = .Increment,
	}
	button2 := ui_e(game)
	button2.position = rl.Rectangle{200, 240, 100, 50}
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
	id:       int,
	distance: f32,
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
	mp_2d := (rl.GetMousePosition() - state.camera2d.offset) / state.camera2d.zoom

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
					append(&rayHit, RayHit{distance = collision.distance, id = g.id})
				}
			}
		case Building:
			#partial switch renderer in g.renderer {
			case UIEntity:
				#partial switch ui in renderer.element {
				case Button:
					over_button := rl.CheckCollisionPointRec(mp_2d, renderer.position)
					if over_button {
						append(&rayHit, RayHit{distance = -1, id = g.id})
					}
				}
			}

		}
	}
	slice.sort_by(
		rayHit[:],
		proc(a, b: RayHit) -> bool {
			return a.distance > b.distance // descending order
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

getActive :: proc(state: ^Game) -> ^GameEntity {
	for &e in state.entities {
		if e.selected == .ACTIVE {
			return &e
		}
	}
	return nil
}

find_first_matching :: proc($T: typeid, arr: []T, target: T) -> int {
	for i in 0 ..< len(arr) {
		if arr[i] == target {
			return i
		}
	}
	return -1
}

// TODO: enforce rules around what can connect to what
updateConnection :: proc(game: ^Game, startId, endId: int) {
	start := e_get(game, startId)
	end := e_get(game, endId)
	#partial switch &s in start.entity {
	case Building:
		#partial switch &e in end.entity {
		case Building:
			outputIdx := find_first_matching(int, s.outputIds[:], end.id)
			inputIdx := find_first_matching(int, e.inputIds[:], start.id)
			if inputIdx > -1 || outputIdx > -1 {
				// remove both
				if outputIdx > -1 {
					unordered_remove(&s.outputIds, outputIdx)
				}
				if inputIdx > -1 {
					unordered_remove(&e.inputIds, inputIdx)
				}
			} else {
				// add both
				append(&s.outputIds, end.id)
				append(&e.inputIds, start.id)
				checkUpgrade(game, &e)
			}
		}
	}
}

checkUpgrade :: proc(game: ^Game, building: ^Building) {
	v, ok := building.upgrade.?
	if ok {
		reqs := make([dynamic]Resource, context.temp_allocator)
		for requirement in v.requires {
			append(&reqs, requirement)
		}
		for inputId in building.inputIds {
			input := e_get(game, inputId)
			if input != nil {
				b, ok := input.entity.(Building)
				if ok {
					_, building, _, _ := map_entry(&game.blueprints, b.name)
					fmt.println(building)
					for output in building.output {
						inputIdx := find_first_matching(Resource, reqs[:], output)
						if inputIdx > -1 {
							unordered_remove(&reqs, inputIdx)
						}
					}
				}
			}
		}
		if len(reqs) == 0 {
			building.name = v.name
			building.upgrade = nil
		}
		fmt.println(building)
	}
}

tick :: proc(state: ^Game) {
	update_time(state)

	// handle scrolling
	if rl.IsMouseButtonDown(.RIGHT) {
		state.camera2d.offset += rl.GetMouseDelta()
	}

	// TODO: zoom into mouse pointer
	state.camera2d.zoom += rl.GetMouseWheelMove() / 10
	state.camera2d.zoom = math.clamp(state.camera2d.zoom, 0.2, 5)

	// TODO: add a spawning mechanic?
	// TODO: actually flow input to output
	// TODO: implement building dragging seperate from resource dragging
	// TODO: implement "Explore!"
	// TODO: implement "Degrade" mechanic
	// TODO: impelment timer for upgrade

	switch state.state {
	case .GAME_OVER:
	case .PLAYING:
		if state.time.tick % TICK_TO_SPAWN == 0 {
			spawn_enemy_rand(state)
		}

		rayHit := get_ray_hits(state)


		left_pressed := rl.IsMouseButtonPressed(.LEFT)
		left_released := rl.IsMouseButtonReleased(.LEFT)
		for i in 0 ..< len(state.entities) {
			if len(rayHit) > 0 && rayHit[len(rayHit) - 1].id == state.entities[i].id {
				md := rl.IsMouseButtonDown(.LEFT)
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
					if left_released {
						// check if there's a connection to be made / unmade here	
						active := getActive(state)
						if active != nil {
							updateConnection(state, active.id, state.entities[i].id)
						}
					}
				}
			}
		}
		for i in 0 ..< len(state.entities) {
			if len(rayHit) > 0 && rayHit[len(rayHit) - 1].id == state.entities[i].id {
			} else {
				if left_released {
					state.entities[i].selected = .INACTIVE
				}
				if state.entities[i].selected != .ACTIVE {
					state.entities[i].selected = .INACTIVE
				}
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

drawRect :: proc(start, end: rl.Vector2, width: f32, color: rl.Color) {
	angle := -rl.Vector2LineAngle(end - start, rl.Vector2{0, 1})
	length := rl.Vector2Length(end - start)
	midpoint := (end - start) / 2
	rl.DrawRectanglePro(
		rl.Rectangle{midpoint.x + start.x, midpoint.y + start.y, length, width},
		rl.Vector2{length, width} / 2,
		angle * 360 / math.TAU,
		color,
	)
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

	rl.BeginMode2D(state.camera2d)

	mp_2d := (rl.GetMousePosition() - state.camera2d.offset) / state.camera2d.zoom
	// render connections
	for e in state.entities {
		#partial switch entity in e.entity {
		case Building:
			#partial switch renderer in e.renderer {
			case UIEntity:
				// if it has any outgoing connections, draw them
				for outId in entity.outputIds {
					target := e_get(state, outId)
					if target != nil {

						#partial switch t_entity in target.entity {
						case Building:
							#partial switch t_render in target.renderer {
							case UIEntity:
								// TODO: render this being mindful of overlap (ex: if two nodes form a cycle)
								drawRect(
									rl.Vector2 {
										renderer.position.x + renderer.position.width / 2,
										renderer.position.y + renderer.position.height / 2,
									},
									rl.Vector2 {
										t_render.position.x + t_render.position.width / 2,
										t_render.position.y + t_render.position.height / 2,
									},
									20,
									rl.Color{220, 40, 20, 255},
								)

							}
						}
					}
				}
			}
		}
	}

	// render entities
	for e in state.entities {
		#partial switch entity in e.entity {
		case Building:
			#partial switch renderer in e.renderer {
			case UIEntity:
				button_color := rl.Color{200, 200, 200, 255}

				switch e.selected {
				case .INACTIVE:
					button_color = rl.Color{200, 200, 200, 255}
				case .HOT:
					button_color = rl.Color{0, 200, 200, 255}
				case .ACTIVE:
					button_color = rl.Color{200, 0, 200, 255}
					// check if click and drage
					// TODO: render this either consistently behind or in front of buildings
					drawRect(
						rl.Vector2 {
							renderer.position.x + renderer.position.width / 2,
							renderer.position.y + renderer.position.height / 2,
						},
						mp_2d,
						20,
						rl.Color{0, 200, 0, 255},
					)
				}

				gui.render_button(gui.Button{color = button_color, position = renderer.position})
				gui.render_text_box(
					gui.TextBox {
						position = rl.Vector2 {
							f32(renderer.position.x) + renderer.position.width / 2,
							f32(renderer.position.y) + renderer.position.height / 2,
						},
						font_size = 14,
						text_val = strings.clone_to_cstring(entity.name, context.temp_allocator),
						color = oklab.OkLab{0.2, 0.2, 0.45, 1.},
					},
				)
			}
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

makeDynamic :: proc($T: typeid, slice: []T) -> [dynamic]T {
	arr := make([dynamic]T, 0, 10)
	for elem in slice {
		append(&arr, elem)
	}
	return arr
}

seedBlueprints :: proc(game: ^Game) {

	map_insert(
		&game.blueprints,
		"village",
		Blueprint {
			name = "Village",
			input = makeDynamic(Resource, []Resource{Resource{class = .Food, domain = .Base}}),
			output = makeDynamic(Resource, []Resource{Resource{class = .Person, domain = .Base}}),
		},
	)
	map_insert(
		&game.blueprints,
		"farm",
		Blueprint {
			name = "Farm",
			input = makeDynamic(Resource, []Resource{Resource{class = .Person, domain = .Base}}),
			output = makeDynamic(Resource, []Resource{Resource{class = .Food, domain = .Base}}),
		},
	)
	map_insert(&game.blueprints, "field", Blueprint{name = "Field"})

}

makeBuilding :: proc(game: ^Game) -> ^GameEntity {

	g := entity(game)
	g.entity = Building {
		name = "village",
	}
	g.renderer = UIEntity {
		element  = Button{},
		position = rl.Rectangle{0, 0, 100, 100},
	}
	g2 := entity(game)
	g2.entity = Building {
		name = "field",
		upgrade = Upgrade {
			requires = makeDynamic(
				Resource,
				[]Resource{Resource{class = .Person, domain = .Base}},
			),
			name = "farm",
		},
		triggers = makeDynamic(
			Trigger,
			[]Trigger {
				Trigger {
					conditions = Fill {
						resource = Resource{class = .Person, domain = .Base},
						min = 0,
						max = 100,
						target = 100,
					},
					results = ReplaceLocation{name = "farm"},
				},
			},
		),
	}
	g2.renderer = UIEntity {
		element  = Button{},
		position = rl.Rectangle{300, 20, 100, 100},
	}
	return g
}

init :: proc() -> Game {
	state := Game{}
	seedBlueprints(&state)
	makeBuilding(&state)
	makeGround(&state)
	// test deletion
	restart(&state)
	return state
}
