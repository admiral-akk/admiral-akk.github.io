# Design

## Philosophy

- Everything should move the game _forward_
  - Should never reach the same board state twice.
- Player should always have a meaningful choice on what should be connected.
  - No dominant strategy of just _always_ passing in matching inputs.
- Player should have some self-expression
  - There should be different paths to "winning".

## Game loop

Events appear - some are beneficial, some are negative.

Player decides which locations to connect to which events.

Events are resolved, creating new locations / events.

## Mechanics

### Resources

Resources have "attributes" which are needed to solve problems. Should indicate what abilities they have?

Brainstorm - Attributes:

- can fight
- can be eaten
- can
- Combat
- Person
- Animal
- Food
- Science
- Goods
- Widgets

Brainstorm - things in the real world:

- Farmer, doctor, teacher, scientist, engineer, mechanic, banker, politician, priest, police, solider
- Brick, stone, wood, glass, metal, fruit, grain, meat, water, gold, silver, iron, bronze, plant, energy
- Electronics, gears, pipes, wheels, cooked food, hammer, nail, pot, pan, pillar, bag, clothes, books

### Locations

- Generates a resource
- Can output resource to Events

### Events

- Targets a Location
- Takes input(s) from Locations
- Triggers Actions
  - Either by input threshold being reached or by timeout
  - One of either the timeout or input should destroy the event

### Action

- Can apply to a Event or Location

## Content

### Menus

We can actually create the menus via this system:

- Location: Start
- Event: Game (connect start to this to start the game)

- Location: Try
- Event: Again (connect try to this to restart the game)

### Prototype

Win: Complete the Raid! event

Lose: Have your village disabled

- Start with Village + Famine! + Explore!
  - If Famine! triggers, LOSS.
- Explore! leads to Field
- Field treats Famine!, creating ???
- ???
- ???
- Raid! appears, targeting Field
  - If Raid! triggers targeting village, LOSS.
- Barracks defeats Raid!, WIN

### Resources

Resources have "attributes" which are needed to solve problems

Attributes:

- Combat
- Food
- Science
- Goods
- Widgets

Brainstorm - things in the real world:

- Farmer, doctor, teacher, scientist, engineer, mechanic, banker, politician, priest, police, solider
- Brick, stone, wood, glass, metal, fruit, grain, meat, water, gold, silver, iron, bronze, plant, energy
- Electronics, gears, pipes, wheels, cooked food, hammer, nail, pot, pan, pillar, bag, clothes, books

Explorer - human
Warrior - combat, human
Farmer -

### Locations

Village

- Output: Explorer

Field

- Output: Food

Barracks

- Output: Fighter

### Events

Famine!

- Timeout
  - Disable target
  - Retarget
- Input:
  - Person (any)
- Result:
  - Destroy Event
  - Spawn Invent!

Raid!

- Timeout:
  - Disable target
  - Retarget
- Input:
  - Fighter
- Result:
  - Destroy Event
  - Spawn Invent!

Explore!

- Timeout:
  - Destroy Event
- Input:
  - Scout
- Result:
  - Spawn new Location

Invent!

- Timeout:
  - Destroy Event
- Input:
  - Scout
- Result:
  - Transform target Location

### Actions

Spawn

- Creates a Event or Location

Destroy

- Deletes an Event or Location

Transform

- Turns a Location into something else

Disable

- Disables the output of a location

Restore

- Restores a Locations output

Retarget

- Targets a new location if possible, or destroys event if not
