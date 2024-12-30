import { Unit } from "../../components/game/unit.js";
import { System } from "../../ecs/system.js";

export class AnimateUnitPath extends System {
  constructor() {
    super([Unit]);
  }

  apply({ unit }) {
    const stack = unit.animationStack;
    var i = stack.start;
    var count = stack.count;
    while (count--) {
      i = (i + 1) % stack.length;
    }
  }
}
