import { Animated } from "../../components/render/animations";
import { System } from "../../engine/ecs/system";
import { time } from "../../engine/time";

export class ApplyAnimations extends System {
  constructor() {
    super([Animated]);
  }

  // representing animations like this kinda defeats the point
  // of ECS, but it works for now?
  //
  // alt: could dynamically create systems as animations need them
  apply({ animated }) {
    animated.animations.forEach((a) => {
      if (a.apply(time.time)) {
        animated.animations.remove(a);
      }
    });
  }
}
