import { vec3 } from "gl-matrix";
import { Transform } from "../components/transform.js";
import { Unit } from "../components/unit.js";
import { System } from "../ecs/system.js";
import { toHexPosition } from "./animateMeshTransform.js";

class AnimateUnits extends System {
  constructor() {
    super([Transform, Unit]);
  }

  apply({ transform, unit }) {
    const time = Date.now();
    while (
      unit.animationStack.length > 0 &&
      unit.animationStack[0][1] <= time
    ) {
      unit.animationStack.shift();
    }
    if (unit.animationStack.length === 0) {
      const target = toHexPosition([unit.pos[0], unit.pos[1]]);
      target[1] = 0.25;
      transform.setPosition(target);
    } else {
      const [startTime, endTime, startPos, endPos] = unit.animationStack[0];
      const t = (time - startTime) / (endTime - startTime);
      const start = toHexPosition(startPos);
      const target = toHexPosition(endPos);
      const interpolate = vec3.create();
      vec3.scale(start, start, 1 - t);
      vec3.scale(target, target, t);
      vec3.add(interpolate, start, target);
      interpolate[1] = 0.25 + Math.abs(Math.sin(t * Math.PI * 2 * 3)) * 0.1;
      transform.setPosition(interpolate);
    }
  }
}

export { AnimateUnits };
