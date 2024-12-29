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
    if (unit.moveStart !== null) {
      // check if done
      const time = Date.now();
      const t = (time - unit.moveStart) / 1000;
      if (t > 1) {
        unit.pos = unit.movingTo;
        unit.movingTo = null;
        unit.moveStart = null;
      } else {
        const start = toHexPosition(unit.pos);

        const target = toHexPosition(unit.movingTo);
        const interpolate = vec3.create();
        vec3.scale(start, start, 1 - t);
        vec3.scale(target, target, t);
        vec3.add(interpolate, start, target);
        interpolate[1] = 0.25 + Math.abs(Math.sin(t * Math.PI * 2 * 3)) * 0.1;
        transform.setPosition(interpolate);
      }
    }
    if (unit.movingTo === null) {
      const target = toHexPosition([unit.pos[0], unit.pos[1]]);
      target[1] = 0.25;
      transform.setPosition(target);
      return;
    }
  }
}

export { AnimateUnits };
