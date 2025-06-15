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

game := Game{}

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
	loop:         bool,
}

AlwaysFalse :: struct {
}

EventCondition :: union {
	EventFill,
	EventDrain,
	EventTimer,
	AlwaysFalse,
}

EventDestroy :: struct {
	targetId: int,
}

EventReplace :: struct {
	targetId: int,
	name:     LocationType,
}

EventExplore :: struct {
}


NodeType :: union {
	LocationType,
	EventType,
}


EventResult :: union {
	EventDestroy,
	EventReplace,
	EventExplore,
}

EventType :: enum {
	Famine,
	Maintance,
	Innovation,
	Discover,
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

Button :: struct {
}

// elements that have persistent state
UIElement :: union {
	Button,
}

UIEntity :: struct {
	element:  UIElement,
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
	camera3d:   rl.Camera3D,
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

RayHit :: struct {
	id:       int,
	distance: f32,
}

get_ray_hits :: proc(state: ^Game) -> [dynamic]RayHit {
	mp := rl.GetMousePosition()
	ray := rl.GetScreenToWorldRay(mp, state.camera3d) // Get a ray trace from screen position (i.e mouse)
	rayHit := make([dynamic]RayHit)
	mp_2d := (rl.GetMousePosition() - state.camera2d.offset) / state.camera2d.zoom

	// find the ray hits
	for i in 0 ..< len(state.entities) {
		g := state.entities[i]
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
		// TODO: add 3d hit?
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
			if outputIdx > -1 {
				unordered_remove(&s.outputIds, outputIdx)
			} else {
				append(&s.outputIds, end.id)
			}
		case Event:
			outputIdx := find_first_matching(int, s.outputIds[:], end.id)
			if outputIdx > -1 {
				unordered_remove(&s.outputIds, outputIdx)
			} else {
				append(&s.outputIds, end.id)
			}
		}
	}
}

getEventName :: proc(event: EventType) -> string {
	switch event {
	case .Innovation:
		return "Innovation"
	case .Maintance:
		return "Maintance"
	case .Discover:
		return "Discover"
	case .Famine:
		return "Famine"
	}
	return "UNKNOWN?"
}

getBlueprint :: proc(game: ^Game, name: LocationType) -> ^Blueprint {
	_, building, _, _ := map_entry(&game.blueprints, name)
	return building
}

getInputs :: proc(game: ^Game, target: ^GameEntity) -> [dynamic]Resource {
	inputs := make([dynamic]Resource, context.temp_allocator)
	for e in game.entities {
		b, ok := e.entity.(Building)
		if ok {
			// check if it's connected 
			idx := find_first_matching(int, b.outputIds[:], target.id)
			if idx > -1 {
				blueprint := getBlueprint(game, b.name)
				append(&inputs, ..blueprint.output[:])
			}
		}
	}
	return inputs
}

updateConditions :: proc(game: ^Game) {
	for i := len(game.entities) - 1; i >= 0; i -= 1 {
		entity := &game.entities[i]
		#partial switch &e in entity.entity {
		case Event:
			inputs := getInputs(game, entity)
			switch &c in e.endCondition {
			case EventFill:
				inputIdx := find_first_matching(Resource, inputs[:], c.resource)
				if inputIdx > -1 {
					c.current += 1

				} else {
					c.current -= 1
				}
				c.current = math.clamp(c.current, 0, c.max)
			case EventDrain:
				inputIdx := find_first_matching(Resource, inputs[:], c.resource)
				if inputIdx > -1 {
					c.current += 1

				} else {
					c.current -= 1
				}
				c.current = math.clamp(c.current, c.min, 0)
			case EventTimer:
				c.currentTicks += 1
				if c.loop && c.currentTicks > c.totalTicks {
					// we set it to 1 here because we want to ensure
					// it happens every total ticks.
					c.currentTicks = 1
				}
			case AlwaysFalse:
			}
			switch &c in e.resultCondition {
			case EventFill:
				inputIdx := find_first_matching(Resource, inputs[:], c.resource)
				if inputIdx > -1 {
					c.current += 1

				} else {
					c.current -= 1
				}
				c.current = math.clamp(c.current, 0, c.max)
			case EventDrain:
				inputIdx := find_first_matching(Resource, inputs[:], c.resource)
				if inputIdx > -1 {
					c.current += 1

				} else {
					c.current -= 1
				}
				c.current = math.clamp(c.current, c.min, 0)
			case EventTimer:
				c.currentTicks += 1
				if c.loop && c.currentTicks > c.totalTicks {
					// we set it to 1 here because we want to ensure
					// it happens every total ticks.
					c.currentTicks = 1
				}
			case AlwaysFalse:
			}
		}
	}
}

destroyLocation :: proc(game: ^Game, id: int) {
	// remove any thing pointing at it
	for &e in game.entities {
		v, ok := e.entity.(Building)
		if ok {
			idx := find_first_matching(int, v.outputIds[:], id)
			for idx > -1 {
				unordered_remove(&v.outputIds, idx)
				idx = find_first_matching(int, v.outputIds[:], id)
			}
		}
	}
	delete_e(game, id)
}

conditionMet :: proc(condition: ^EventCondition) -> bool {
	switch &c in condition {
	case EventFill:
		return c.current >= c.max
	case EventDrain:
		return c.current <= c.min
	case EventTimer:
		return c.currentTicks >= c.totalTicks
	case AlwaysFalse:
		return false
	}
	return false
}

applyResult :: proc(game: ^Game, event: ^GameEntity, result: ^EventResult) {
	switch &c in result {
	case EventDestroy:
		destroyLocation(game, c.targetId)
	case EventReplace:
		target := &e_get(game, c.targetId).entity.(Building)
		target.name = c.name
	case EventExplore:
		// spawn a new tile or event
		// tile:
		pos := event.renderer.(UIEntity).position
		l := spawnLocation(game, rl.Vector2{pos.x + pos.width / 2, pos.y + pos.height / 2}, .Field)
	}
}

resetCondition :: proc(condition: ^EventCondition) {
	switch &c in condition {
	case EventFill:
		c.current = 0
	case EventDrain:
		c.current = 0
	case EventTimer:
		c.currentTicks = 0
	case AlwaysFalse:
	}
}

resolveTriggers :: proc(game: ^Game) {
	for i := len(game.entities) - 1; i >= 0; i -= 1 {
		entity := &game.entities[i]
		#partial switch &e in entity.entity {
		case Event:
			inputs := getInputs(game, entity)

			endConditionMet := conditionMet(&e.endCondition)
			if endConditionMet {
				// destroy this
				destroyLocation(game, entity.id)
			} else {
				// check whether the results trigger
				resultConditionMet := conditionMet(&e.resultCondition)
				if resultConditionMet {
					// trigger results
					applyResult(game, entity, &e.result)
					resetCondition(&e.resultCondition)
				}
			}
		}
	}
}

moveOverlap :: proc(state: ^Game) {
	// TODO: have connected nodes attract
	for &e in state.entities {
		ui, ok := &e.renderer.(UIEntity)
		if !ok {
			continue
		}
		for &e2 in state.entities {
			if e2.id == e.id {
				continue
			}
			ui2, ok2 := &e2.renderer.(UIEntity)
			if !ok2 {
				continue
			}

			// make them fatter

			buffer := f32(20.0)
			rect1 := ui.position
			rect2 := ui2.position

			rect1.x -= buffer / 2.0
			rect1.y -= buffer / 2.0
			rect1.width += buffer
			rect1.height += buffer

			rect2.x -= buffer / 2
			rect2.y -= buffer / 2
			rect2.width += buffer
			rect2.height += buffer

			// check intersection
			if !rl.CheckCollisionRecs(rect1, rect2) {
				continue
			}

			c1 := rl.Vector2 {
				ui.position.x + ui.position.width / 2,
				ui.position.y + ui.position.height / 2,
			}
			c2 := rl.Vector2 {
				ui2.position.x + ui2.position.width / 2,
				ui2.position.y + ui2.position.height / 2,
			}
			// if they are in the same position, jiggle one around
			if rl.Vector2Length(c1 - c2) < 0.001 {
				// generate a random direction and move it 0.005 that way.
				angle := rand.float32_range(0., math.TAU)
				ui.position.x += 0.005 * math.cos(angle)
				ui.position.y += 0.005 * math.sin(angle)
				c1 = rl.Vector2 {
					ui.position.x + ui.position.width / 2,
					ui.position.y + ui.position.height / 2,
				}
			}
			delta := rl.Vector2Normalize(c1 - c2) * 2

			// move them apart
			// TODO: add momentum

			ui.position.x += delta.x
			ui.position.y += delta.y
			ui2.position.x -= delta.x
			ui2.position.y -= delta.y
		}

	}
}

tick :: proc() {
	update_time(&game)

	// handle scrolling
	if rl.IsMouseButtonDown(.RIGHT) {
		game.camera2d.offset += rl.GetMouseDelta()
	}

	// TODO: zoom into mouse pointer, as opposed to origin?
	game.camera2d.zoom += rl.GetMouseWheelMove() / 10
	game.camera2d.zoom = math.clamp(game.camera2d.zoom, 0.2, 5)

	// TODO: implement building dragging seperate from resource dragging
	// TODO: render timers
	// TODO: add nodes that player cannot control (IE, natural disasters)

	switch game.state {
	case .GAME_OVER:
	case .PLAYING:
		rayHit := get_ray_hits(&game)


		left_pressed := rl.IsMouseButtonPressed(.LEFT)
		left_released := rl.IsMouseButtonReleased(.LEFT)
		for i in 0 ..< len(game.entities) {
			if len(rayHit) > 0 && rayHit[len(rayHit) - 1].id == game.entities[i].id {
				switch game.entities[i].selected {
				case .INACTIVE:
					if left_pressed {
						game.entities[i].selected = .ACTIVE

					} else {
						game.entities[i].selected = .HOT
					}
				case .ACTIVE:
					if left_released {
						game.entities[i].selected = .HOT
					}
				case .HOT:
					if left_pressed {
						game.entities[i].selected = .ACTIVE
					}
					if left_released {
						// check if there's a connection to be made / unmade here	
						active := getActive(&game)
						if active != nil {
							updateConnection(&game, active.id, game.entities[i].id)
						}
					}
				}
			}
		}
		for i in 0 ..< len(game.entities) {
			if len(rayHit) > 0 && rayHit[len(rayHit) - 1].id == game.entities[i].id {
			} else {
				if left_released {
					game.entities[i].selected = .INACTIVE
				}
				if game.entities[i].selected != .ACTIVE {
					game.entities[i].selected = .INACTIVE
				}
			}
		}

		updateConditions(&game)
		resolveTriggers(&game)
		moveOverlap(&game)
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

spawnLocation :: proc(game: ^Game, position: rl.Vector2, location: LocationType) -> ^GameEntity {
	g := entity(game)
	g.entity = Building {
		name = location,
	}
	g.renderer = UIEntity {
		element  = Button{},
		position = rl.Rectangle {
			position.x + rand.float32_range(-10, 10),
			position.y + rand.float32_range(-10, 10),
			100,
			100,
		},
	}
	return g
}


render :: proc() {
	// game state
	rl.BeginDrawing()
	rl.ClearBackground({76, 53, 83, 255})

	rl.BeginMode3D(game.camera3d)
	rl.EndMode3D()

	rl.BeginMode2D(game.camera2d)

	mp_2d := (rl.GetMousePosition() - game.camera2d.offset) / game.camera2d.zoom
	// render connections
	for e in game.entities {
		#partial switch entity in e.entity {
		case Event:
			#partial switch renderer in e.renderer {
			case UIEntity:
				// if it has any outgoing connections, draw them
				outId := -1
				switch result in entity.result {
				case EventDestroy:
					outId = result.targetId
				case EventReplace:
					outId = result.targetId
				case EventExplore:

				}

				target := e_get(&game, outId)
				if target != nil {
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

		// TODO: prevent output drag from event
		case Building:
			#partial switch renderer in e.renderer {
			case UIEntity:
				// if it has any outgoing connections, draw them
				for outId in entity.outputIds {
					target := e_get(&game, outId)
					if target != nil {
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

	// render entities
	for e in game.entities {
		#partial switch entity in e.entity {
		case Event:
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
							getEventName(entity.eventType),
							context.temp_allocator,
						),
						color = oklab.OkLab{0.2, 0.2, 0.45, 1.},
					},
				)
			}

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
							getBlueprint(&game, entity.name).name,
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
			output = makeDynamic(Resource, []Resource{Resource{class = .Person, domain = .Base}}),
		},
	)
	map_insert(
		&game.blueprints,
		LocationType.Farm,
		Blueprint {
			name = "Farm",
			output = makeDynamic(Resource, []Resource{Resource{class = .Food, domain = .Base}}),
		},
	)
	map_insert(
		&game.blueprints,
		LocationType.Field,
		Blueprint {
			name = "Field",
			input = makeDynamic(Resource, []Resource{Resource{class = .Person, domain = .Base}}),
			output = makeDynamic(Resource, []Resource{Resource{class = .Food, domain = .Base}}),
		},
	)
}

restart :: proc(game: ^Game) {
	game.camera3d = rl.Camera3D {
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
	g := entity(game)
	g.entity = Building {
		name = .Village,
	}
	g.renderer = UIEntity {
		element  = Button{},
		position = rl.Rectangle{0, 0, 100, 100},
	}

	explore := entity(game)
	explore.entity = Event {
		eventType = .Discover,
		// if this is met, the event fissles.
		endCondition = AlwaysFalse{},
		// all of these must be met for the results to trigger.
		resultCondition = EventFill {
			resource = Resource{class = .Person, domain = .Base},
			max = 100,
		},
		result = EventExplore{},
	}

	explore.renderer = UIEntity {
		element  = Button{},
		position = rl.Rectangle{300, -120, 100, 100},
	}

	famine := entity(game)
	famine.entity = Event {
		eventType = .Famine,
		// if this is met, the event fissles.
		endCondition = EventFill{resource = Resource{class = .Food, domain = .Base}, max = 100},
		// all of these must be met for the results to trigger.
		resultCondition = EventDrain {
			resource = Resource{class = .Food, domain = .Base},
			min = -1000,
		},
		result = EventDestroy{targetId = g.id},
	}

	famine.renderer = UIEntity {
		element  = Button{},
		position = rl.Rectangle{300, -120, 100, 100},
	}

}
init :: proc() -> ^Game {
	seedBlueprints(&game)
	// test deletion
	restart(&game)
	return &game
}
