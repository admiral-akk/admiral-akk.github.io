import { Vec2, Vec3 } from "gl-matrix";
import { MoveCamera } from "../commands/moveCamera.js";
import { State, StateMachine } from "../util/stateMachine.js";
import { time } from "../engine/time.js";

// input manager - client, determines commands
// commands figure out how to apply themselves
// then the state game actions happen
// then we apply a render

// TODO: add a notion of "commands"

// decides what commands a user will issue, if any
//
// commands might be illegal in the game state.
export class InputManager extends StateMachine {
  constructor() {
    super();
    this.pushState(new OpenState());
    this.commands = [];
  }

  update(input) {
    this.currentState().handleInput(this, input);
  }
}

export class OpenState extends State {
  handleInput(manager, input) {
    const { state } = input;

    const move = Vec3.create();

    if (state?.w?.val) {
      move[2] += 1;
    }

    if (state?.s?.val) {
      move[2] -= 1;
    }
    if (state?.a?.val) {
      move[0] += 1;
    }
    if (state?.d?.val) {
      move[0] -= 1;
    }

    const rotateAngle =
      (0.05 * ((state?.q?.val ?? 0) - (state?.e?.val ?? 0))) / Math.PI;

    let zoom = 0;

    let mouseDelta = new Vec2();

    if (
      state?.rmb?.val === 1 &&
      state?.mpos?.frame === time.frame &&
      state?.mpos?.prev?.val
    ) {
      mouseDelta = Vec2.clone(state.mpos.val).sub(state?.mpos?.prev.val);
    }

    if (
      state?.wheel?.frame === time.frame &&
      state?.wheel?.prev?.val !== state?.wheel?.val
    ) {
      zoom = state.wheel.val - state.wheel.prev.val;
    }

    if (
      move[0] !== 0 ||
      move[2] !== 0 ||
      zoom !== 0 ||
      rotateAngle !== 0 ||
      mouseDelta.x !== 0 ||
      mouseDelta.y !== 0
    ) {
      manager.commands.push(
        new MoveCamera({ move, rotateAngle, zoom, mouseDelta })
      );
    }
  }
}
