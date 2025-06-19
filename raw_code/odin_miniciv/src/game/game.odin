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

ResourceType :: enum {
	Scout,
	Soldier,
	Priest,
	Food,
}

getEventName :: proc(event: EventType) -> string {
	switch event {
	case .Invent:
		return "Invent!"
	case .Explore:
		return "Explore!"
	case .Raid:
		return "Raid!"
	case .Famine:
		return "Famine!"
	case .Festival:
		return "Festival!"
	}
	return "UNKNOWN?"
}

EventType :: enum {
	Famine,
	Festival,
	Invent,
	Explore,
	Raid,
}

LocationType :: enum {
	Village,
	Field,
	Spear,
	Fire,
}


Blueprint :: struct {
	name:   string,
	input:  [dynamic]ResourceType,
	output: [dynamic]ResourceType,
}

// always starts at 0, decrements if missing, increments if provided.
// true iff current == max.
EventFill :: struct {
	resource: ResourceType,
	max:      int,
	current:  int,
}

// always starts at 0, decrements if missing, increments if provided.
// true iff current == min.
EventDrain :: struct {
	resource: ResourceType,
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
	name:     NodeType,
}

EventDiscover :: struct {
}


NodeType :: union {
	LocationType,
	EventType,
}

get_first_matching :: proc(t: NodeType) -> ^GameEntity {
	for &e in game.entities {
		switch t in t {
		case LocationType:
			b, ok := e.entity.(Building)
			if !ok {
				continue
			}
			if b.name == t {
				return &e
			}
		case EventType:
			event, ok := e.entity.(Event)
			if !ok {
				continue
			}
			if event.eventType == t {
				return &e
			}
		}
	}
	return nil
}

toEntityType :: proc(t: NodeType) -> Maybe(EntityType) {
	switch t in t {
	case LocationType:
		return Building{name = t}
	case EventType:
		event := Event {
			eventType = t,
		}
		switch t {
		case .Famine:
			event.endCondition = EventFill {
				resource = .Food,
				max      = 100,
			}
			event.resultCondition = EventDrain {
				resource = .Food,
				min      = -1000,
			}
			// find target
			target := get_first_matching(.Village)

			event.result = EventDestroy {
				targetId = target.id,
			}
		case .Explore:
			event.endCondition = AlwaysFalse{}
			event.resultCondition = EventFill {
				resource = .Scout,
				max      = 100,
			}
			event.result = EventDiscover{}
		case .Invent:
		case .Raid:
		case .Festival:
		}
		return event
	}
	return nil
}

spawn :: proc(t: NodeType) -> ^GameEntity {
	e := entity()
	e.renderer = UIEntity {
		element  = Button{},
		position = rl.Rectangle{0, 0, 100, 100},
	}
	e.entity = toEntityType(t).?
	return e
}

EventResult :: union {
	EventDestroy,
	EventReplace,
	EventDiscover,
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

entity :: proc() -> ^GameEntity {
	e := GameEntity {
		renderer = MeshRenderer{material = "base", mesh = "base"},
		id = game.entityId,
	}
	game.entityId += 1
	append(&game.entities, e)
	return &game.entities[len(game.entities) - 1]
}

e_get :: proc(id: int) -> ^GameEntity {
	for i in 0 ..< len(game.entities) {
		if game.entities[i].id == id {
			return &game.entities[i]
		}
	}

	return nil
}

delete_e :: proc(entityId: int) {
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
updateConnection :: proc(startId, endId: int) {
	start := e_get(startId)
	end := e_get(endId)
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

getBlueprint :: proc(name: LocationType) -> Blueprint {
	switch name {
	case .Field:
		return Blueprint {
			name = "Field",
			input = makeDynamic(ResourceType, []ResourceType{.Scout}),
			output = makeDynamic(ResourceType, []ResourceType{.Food}),
		}
	case .Village:
		return Blueprint {
			name = "Village",
			output = makeDynamic(ResourceType, []ResourceType{.Scout}),
		}
	case .Spear:
		return Blueprint {
			name = "Spear",
			input = makeDynamic(ResourceType, []ResourceType{.Scout}),
			output = makeDynamic(ResourceType, []ResourceType{.Soldier}),
		}
	case .Fire:
		return Blueprint {
			name = "Fire",
			input = makeDynamic(ResourceType, []ResourceType{.Scout}),
			output = makeDynamic(ResourceType, []ResourceType{.Priest}),
		}
	}
	return Blueprint{}
}

getInputs :: proc(target: ^GameEntity) -> [dynamic]ResourceType {
	inputs := make([dynamic]ResourceType, context.temp_allocator)
	for e in game.entities {
		b, ok := e.entity.(Building)
		if ok {
			// check if it's connected 
			idx := find_first_matching(int, b.outputIds[:], target.id)
			if idx > -1 {
				blueprint := getBlueprint(b.name)
				append(&inputs, ..blueprint.output[:])
			}
		}
	}
	return inputs
}

updateConditions :: proc() {
	for i := len(game.entities) - 1; i >= 0; i -= 1 {
		entity := &game.entities[i]
		#partial switch &e in entity.entity {
		case Event:
			inputs := getInputs(entity)
			switch &c in e.endCondition {
			case EventFill:
				inputIdx := find_first_matching(ResourceType, inputs[:], c.resource)
				if inputIdx > -1 {
					c.current += 1

				} else {
					c.current -= 1
				}
				c.current = math.clamp(c.current, 0, c.max)
			case EventDrain:
				inputIdx := find_first_matching(ResourceType, inputs[:], c.resource)
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
				inputIdx := find_first_matching(ResourceType, inputs[:], c.resource)
				if inputIdx > -1 {
					c.current += 1

				} else {
					c.current -= 1
				}
				c.current = math.clamp(c.current, 0, c.max)
			case EventDrain:
				inputIdx := find_first_matching(ResourceType, inputs[:], c.resource)
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

destroyLocation :: proc(id: int) {
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
	delete_e(id)
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

applyResult :: proc(event: ^GameEntity, result: ^EventResult) {
	switch &c in result {
	case EventDestroy:
		destroyLocation(c.targetId)
	case EventReplace:
		target := e_get(c.targetId)
		target.entity = toEntityType(c.name).?
	case EventDiscover:
		event.entity = toEntityType(.Field).?
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

resolveTriggers :: proc() {
	for i := len(game.entities) - 1; i >= 0; i -= 1 {
		entity := &game.entities[i]
		#partial switch &e in entity.entity {
		case Event:
			inputs := getInputs(entity)

			endConditionMet := conditionMet(&e.endCondition)
			if endConditionMet {
				// destroy this
				destroyLocation(entity.id)
			} else {
				// check whether the results trigger
				resultConditionMet := conditionMet(&e.resultCondition)
				if resultConditionMet {
					// trigger results
					applyResult(entity, &e.result)
					resetCondition(&e.resultCondition)
				}
			}
		}
	}
}

getOutputConnections :: proc(entity: ^GameEntity) -> [dynamic]int {
	connections := make([dynamic]int, context.temp_allocator)
	switch &e in entity.entity {
	case Building:
		append(&connections, ..e.outputIds[:])
	case Event:
		switch &r in e.result {
		case EventDestroy:
			append(&connections, r.targetId)
		case EventReplace:
			append(&connections, r.targetId)
		case EventDiscover:

		}
	}
	return connections
}

moveOverlap :: proc() {
	// Handle intersecting nodes
	for &e in game.entities {
		ui, ok := &e.renderer.(UIEntity)
		if !ok {
			continue
		}
		for &e2 in game.entities {
			if e2.id == e.id {
				continue
			}
			ui2, ok2 := &e2.renderer.(UIEntity)
			if !ok2 {
				continue
			}

			// make them fatter

			buffer := f32(10.0)
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

			ui.position.x += delta.x
			ui.position.y += delta.y
			ui2.position.x -= delta.x
			ui2.position.y -= delta.y
		}

		connections := getOutputConnections(&e)
		for connection in connections {
			target := e_get(connection)
			if target == nil {
				continue
			}
			ui3, ok3 := &target.renderer.(UIEntity)
			if !ok3 {
				continue
			}

			// pull the nodes together like a spring
			c1 := rl.Vector2 {
				ui.position.x + ui.position.width / 2,
				ui.position.y + ui.position.height / 2,
			}
			c3 := rl.Vector2 {
				ui3.position.x + ui3.position.width / 2,
				ui3.position.y + ui3.position.height / 2,
			}
			dir := (c3 - c1)
			dir -= rl.Vector2Normalize(dir) * 300
			if rl.Vector2Length(dir) > 40 {
				dir *= 0.01

				// Handle connected nodes
				ui.position.x += dir.x
				ui.position.y += dir.y
				ui3.position.x -= dir.x
				ui3.position.y -= dir.y

			}
			for &e2 in game.entities {
				if e2.id == e.id {
					continue
				}
				if e2.id == target.id {
					continue
				}
				ui2, ok2 := &e2.renderer.(UIEntity)
				if !ok2 {
					continue
				}
				c1 = rl.Vector2 {
					ui.position.x + ui.position.width / 2,
					ui.position.y + ui.position.height / 2,
				}
				c2 := rl.Vector2 {
					ui2.position.x + ui2.position.width / 2,
					ui2.position.y + ui2.position.height / 2,
				}
				c3 = rl.Vector2 {
					ui3.position.x + ui3.position.width / 2,
					ui3.position.y + ui3.position.height / 2,
				}
				// check if the entity is too close to the line
				if !rl.CheckCollisionPointLine(c2, c1, c3, 100) {
					continue
				}

				// find what side of line c2 is on

				lineDir := rl.Vector2Normalize(c3 - c1)
				moveDir := rl.Vector2{-lineDir.y, lineDir.x}
				lineSide := rl.Vector2DotProduct(moveDir, c2 - c1)
				if lineSide > 0 {
					moveDir *= -1
				}

				// Handle nodes that sit on top of a connection
				ui.position.x += moveDir.x
				ui.position.y += moveDir.y
				ui3.position.x += moveDir.x
				ui3.position.y += moveDir.y
				ui2.position.x -= moveDir.x
				ui2.position.y -= moveDir.y
			}
		}
	}
}

tick :: proc() {
	update_time(&game)

	// handle panning
	if rl.IsMouseButtonDown(.RIGHT) {
		game.camera2d.offset += rl.GetMouseDelta()
	}

	// handle scrolling
	// TODO: zoom into mouse pointer, as opposed to origin?
	game.camera2d.zoom += rl.GetMouseWheelMove() / 10
	game.camera2d.zoom = math.clamp(game.camera2d.zoom, 0.2, 5)

	// TODO: implement building dragging seperate from resource dragging
	// TODO: render timers
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
							updateConnection(active.id, game.entities[i].id)
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

		updateConditions()
		resolveTriggers()
		moveOverlap()
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

spawnLocation :: proc(position: rl.Vector2, location: LocationType) -> ^GameEntity {
	g := entity()
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
	// TODO: switch to using Rect as "center" + "width / height" (instead of top right corner + width / height)
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
				case EventDiscover:

				}

				target := e_get(outId)
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
					target := e_get(outId)
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
							getBlueprint(entity.name).name,
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

restart :: proc() {
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
	g := spawn(.Village)
	spawn(.Famine)
	spawn(.Explore)

}
init :: proc() {
	restart()
}
