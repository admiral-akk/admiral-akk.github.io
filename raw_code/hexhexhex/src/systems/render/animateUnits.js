import { vec3 } from "gl-matrix";
import { Transform } from "../../components/render/transform.js";
import { Unit } from "../../components/game/unit.js";
import { System } from "../../ecs/system.js";
import { toHexPosition } from "./animateMeshTransform.js";

class AnimateUnits extends System {
  constructor() {
    super([Transform, Unit]);
  }

  apply({ transform, unit }) {
    const time = Date.now();
    var activeAnimation = unit.animationStack.front();
    while (activeAnimation !== undefined && activeAnimation[1] <= time) {
      unit.animationStack.dequeue();
      activeAnimation = unit.animationStack.front();
    }
    if (activeAnimation === undefined) {
      const target = toHexPosition([unit.pos[0], unit.pos[1]]);
      target[1] = 0.25;
      transform.setPosition(target);
    } else {
      const [startTime, endTime, startPos, endPos] = activeAnimation;
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