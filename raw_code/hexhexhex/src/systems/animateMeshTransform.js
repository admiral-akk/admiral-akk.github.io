import { System } from "../ecs/system";

const sqrt32 = Math.sqrt(3) / 2;
class AnimateMeshTransform extends System {
  constructor() {
    super([]);
  }

  apply(components) {
    const time = Date.now();
    const transform = components[1];
    const hex = components[2];
    const [x, y] = hex.coords;
    const [xDim, yDim] = hex.dim;

    const xOffset = 1.5 * (x - (xDim - 1) / 2);
    const yOffset = 2 * sqrt32 * (y - (yDim - 1) / 2 + (x % 2 === 0 ? 0.5 : 0));

    transform.setPosition([
      xOffset,
      Math.sin(time / 1000 + xOffset + yOffset / 4),
      yOffset,
    ]);
  }
}

export { AnimateMeshTransform };
