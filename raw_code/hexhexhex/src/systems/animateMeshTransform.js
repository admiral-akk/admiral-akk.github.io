import { Hex } from "../components/hex";
import { Transform } from "../components/transform.js";
import { System } from "../ecs/system";

const sqrt32 = Math.sqrt(3) / 2;
class AnimateMeshTransform extends System {
  constructor() {
    super([Hex, Transform]);
  }

  apply({ hex, transform }) {
    const time = Date.now();
    const [x, y] = hex.coords;

    const xOffset = 1.5 * (x + 1 / 2);
    const yOffset = 2 * sqrt32 * (y + 1 / 2 + (x % 2 === 0 ? 0.5 : 0));

    transform.setPosition([
      xOffset,
      0,
      //Math.sin(time / 1000 + xOffset + yOffset / 4),
      yOffset,
    ]);
  }
}

export { AnimateMeshTransform };
