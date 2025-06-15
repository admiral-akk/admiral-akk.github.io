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
Vec2i :: [2]int

// add some sound effects using the 8-bit midi sound effect thing where you draw them using notes

// Mouse buttons

SelectionState :: enum int {
	INACTIVE = 0,
	HOT      = 1,
	ACTIVE   = 2,
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

Blueprint :: struct {
	name:   string,
	input:  [dynamic]Resource,
	output: [dynamic]Resource,
}

ResourceCondition :: struct {
	class:  Maybe(ResourceClass),
	domain: Maybe(ResourceDomain),
}

// always starts at 0, decrements if missing, increments if provided.
// true iff current == max.
EventFill :: struct {
	resource: Resource,
	max:      int,
	current:  int,
}

// always starts at 0, decrements if missing, increments if provided.
// true iff current == min.
EventDrain :: struct {
	resource: Resource,
	min:      int,
	current:  int,
}

EventTimer :: struct {
	totalTicks:   int,
	currentTicks: int,
}

EventCondition :: union {
	EventFill,
	EventDrain,
	EventTimer,
}

EventDestroy :: struct {
	targetId: int,
}

EventReplace :: struct {
	targetId: int,
	name:     string,
}

EventResult :: union {
	EventDestroy,
	EventReplace,
}

EventType :: enum {
	Maintance,
	Innovation,
}

// This is a one-off Event.
// 
// It does not have output resources. Instead, 
// it takes inputs, and has events.
//
// Examples:
//
// Innovation: given the input, upgrades a building
// Invasion: every X ticks, degrades / destroys a building.
Event :: struct {
	eventType:       EventType,
	// if this is met, the event fissles.
	endCondition:    EventCondition,
	// all of these must be met for the results to trigger.
	resultCondition: EventCondition,
	result:          EventResult,
}

LocationType :: enum {
	Village,
	Field,
	Farm,
}

Building :: struct {
	name:      LocationType,
	triggers:  [dynamic]Trigger,
	inputIds:  [dynamic]int,
	outputIds: [dynamic]int,
}

EntityType :: union {
	Building,
	Event,
}

GameEntity :: struct {
	id:       int,
	entity:   EntityType,
	selected: SelectionState,
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
	name: LocationType,
}

DestroyLocation :: struct {
}

Result :: union {
	ReplaceLocation,
	DestroyLocation,
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
	state:      GameState,
	time:       GameTime,
	entityId:   int,
	entities:   [dynamic]GameEntity,
	camera:     rl.Camera3D,
	camera2d:   rl.Camera2D,
	blueprints: map[LocationType]Blueprint,
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

delete_e :: proc(game: ^Game, entityId: int) {
	for i in 0 ..< len(game.entities) {
		if game.entities[i].id == entityId {
			unordered_remove(&game.entities, i)
			return
		}
	}
}

newGame :: proc(game: ^Game) {
	for len(game.entities) > 0 {
		delete_e(game, game.entities[0].id)
	}
	restart(game)
}

RayHit :: struct {
	id:       int,
	distance: f32,
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

get_ray_hits :: proc(state: ^Game) -> [dynamic]RayHit {
	mp := rl.GetMousePosition()
	ray := rl.GetScreenToWorldRay(mp, state.camera) // Get a ray trace from screen position (i.e mouse)
	rayHit := make([dynamic]RayHit)
	mp_2d := (rl.GetMousePosition() - state.camera2d.offset) / state.camera2d.zoom

	// find the ray hits
	for i in 0 ..< len(state.entities) {
		g := state.entities[i]
		#partial switch entity in g.entity {
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
			}
		}
	}
}

getBlueprint :: proc(game: ^Game, name: LocationType) -> ^Blueprint {
	_, building, _, _ := map_entry(&game.blueprints, name)
	return building
}

getInputs :: proc(game: ^Game, location: ^Building) -> [dynamic]Resource {
	inputs := make([dynamic]Resource, context.temp_allocator)
	for inputId in location.inputIds {
		input := e_get(game, inputId).entity.(Building)

		blueprint := getBlueprint(game, input.name)
		append(&inputs, ..blueprint.output[:])
	}
	return inputs
}

updateConditions :: proc(game: ^Game) {
	for i := len(game.entities) - 1; i >= 0; i -= 1 {
		e := game.entities[i]
		#partial switch &e in e.entity {
		case Building:
			inputs := getInputs(game, &e)
			for &trigger in e.triggers {
				switch &c in trigger.conditions {
				case Fill:
					// check if there's an input that matches
					inputIdx := find_first_matching(Resource, inputs[:], c.resource)
					if inputIdx > -1 {
						// condition met, incremenet
						c.current += 1
					} else {
						// condition failed, decremenet
						c.current -= 1
					}
					c.current = math.clamp(c.current, c.min, c.max)
				case Drain:
					// check if there's an input that matches
					inputIdx := find_first_matching(Resource, inputs[:], c.resource)
					if inputIdx > -1 {
						// condition met, incremenet
						c.current += 1
					} else {
						// condition failed, decremenet
						c.current -= 1
					}
					c.current = math.clamp(c.current, c.min, c.max)

				}
			}
		}
	}
}

destroyLocation :: proc(game: ^Game, id: int) {
	// remove any connections it might have
	for &e in game.entities {
		v, ok := e.entity.(Building)
		if ok {
			idx := find_first_matching(int, v.inputIds[:], id)
			for idx > -1 {
				unordered_remove(&v.inputIds, idx)
				idx = find_first_matching(int, v.inputIds[:], id)
			}
			idx = find_first_matching(int, v.outputIds[:], id)
			for idx > -1 {
				unordered_remove(&v.outputIds, idx)
				idx = find_first_matching(int, v.outputIds[:], id)
			}
		}
	}
	delete_e(game, id)
}

resolveTriggers :: proc(game: ^Game) {
	for i := len(game.entities) - 1; i >= 0; i -= 1 {
		entity := &game.entities[i]
		#partial switch &e in entity.entity {
		case Building:
			inputs := getInputs(game, &e)
			for &trigger in e.triggers {
				conditionMet := false
				switch &c in trigger.conditions {
				case Fill:
					conditionMet = c.current >= c.target
				case Drain:
					conditionMet = c.current <= c.target
				}

				if conditionMet {
					switch &r in trigger.results {
					case ReplaceLocation:
						e.name = r.name
					case DestroyLocation:
						destroyLocation(game, entity.id)
						break
					}
				}
			}
		}
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
	// TODO: render timers
	// TODO: add nodes that player cannot control (IE, natural disasters)
	// TODO: separate out triggers, and producers

	// Producers take inputs, and generate output if all input reqs are met
	// triggers take inputs, and if all conditions are met, trigger some one-off result
	// triggers do not have outputs!

	switch state.state {
	case .GAME_OVER:
	case .PLAYING:
		rayHit := get_ray_hits(state)


		left_pressed := rl.IsMouseButtonPressed(.LEFT)
		left_released := rl.IsMouseButtonReleased(.LEFT)
		for i in 0 ..< len(state.entities) {
			if len(rayHit) > 0 && rayHit[len(rayHit) - 1].id == state.entities[i].id {
				switch state.entities[i].selected {
				case .INACTIVE:
					if left_pressed {
						state.entities[i].selected = .ACTIVE

					} else {
						state.entities[i].selected = .HOT
					}
				case .ACTIVE:
					if left_released {
						state.entities[i].selected = .HOT
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

		updateConditions(state)
		resolveTriggers(state)
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
						text_val = strings.clone_to_cstring(
							getBlueprint(state, entity.name).name,
							context.temp_allocator,
						),
						color = oklab.OkLab{0.2, 0.2, 0.45, 1.},
					},
				)
			}
		}
	}
	rl.EndMode2D()
	rl.BeginMode2D(rl.Camera2D{zoom = f32(WINDOW_SIZE) / SCREEN_SIZE})


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
		LocationType.Village,
		Blueprint {
			name = "Village",
			input = makeDynamic(Resource, []Resource{Resource{class = .Food, domain = .Base}}),
			output = makeDynamic(Resource, []Resource{Resource{class = .Person, domain = .Base}}),
		},
	)
	map_insert(
		&game.blueprints,
		LocationType.Farm,
		Blueprint {
			name = "Farm",
			input = makeDynamic(Resource, []Resource{Resource{class = .Person, domain = .Base}}),
			output = makeDynamic(Resource, []Resource{Resource{class = .Food, domain = .Base}}),
		},
	)
	map_insert(&game.blueprints, LocationType.Field, Blueprint{name = "Field"})

}

makeBuilding :: proc(game: ^Game) -> ^GameEntity {

	g := entity(game)
	g.entity = Building {
		name = .Village,
	}
	g.renderer = UIEntity {
		element  = Button{},
		position = rl.Rectangle{0, 0, 100, 100},
	}
	g2 := entity(game)
	g2.entity = Building {
		name     = .Field,
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
					results = ReplaceLocation{name = .Farm},
				},
				Trigger {
					conditions = Drain {
						resource = Resource{class = .Person, domain = .Base},
						min = 0,
						max = 100,
						target = 0,
						current = 100,
					},
					results = DestroyLocation{},
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


restart :: proc(game: ^Game) {
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
	makeBuilding(game)
}
init :: proc() -> Game {
	state := Game{}
	seedBlueprints(&state)
	// test deletion
	restart(&state)
	return state
}
