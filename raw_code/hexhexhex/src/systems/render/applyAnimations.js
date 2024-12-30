import { Animated } from "../../components/render/animations";
import { System } from "../../ecs/system";
import { time } from "../../engine/time";

export class ApplyAnimations extends System {
  constructor() {
    super([Animated]);
  }

  apply({ animated }) {
    animated.animations.forEach((a) => {
      const finished = a.apply(time.time);
      console.log(a);
      if (finished) {
        animated.animations.remove(a);
      }
    });
  }
}
