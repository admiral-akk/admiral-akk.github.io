import { vec3 } from "gl-matrix";
import { Hex } from "../components/hex";
import { Transform } from "../components/transform.js";
import { System } from "../ecs/system";

const sqrt32 = Math.sqrt(3) / 2;
function toHexPosition([x, y]) {
  const xOffset = 1.5 * (x + 1 / 2) - 1.5 / 2;
  const yOffset = 2 * sqrt32 * (y + 1 / 2 + (x % 2 === 0 ? 0.5 : 0) - 1);

  return vec3.clone([xOffset, 0, yOffset]);
}

class AnimateMeshTransform extends System {
  constructor() {
    super([Hex, Transform]);
  }

  apply({ hex, transform }) {
    transform.setPosition(toHexPosition(hex.coords));
  }
}

export { AnimateMeshTransform, toHexPosition };
