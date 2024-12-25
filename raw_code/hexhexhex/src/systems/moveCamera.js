import { Camera } from "../components/camera.js";
import { Transform } from "../components/transform.js";
import { System } from "../ecs/system";
import { vec3 } from "gl-matrix";

const temp = vec3.create();
class MoveCamera extends System {
  constructor() {
    super([Camera, Transform]);
  }

  apply({ camera, transform }) {
    vec3.sub(temp, camera.target, camera.origin);
    vec3.scale(temp, temp, 0.1);
    vec3.add(camera.origin, temp, camera.origin);
  }
}

export { MoveCamera };
