import { Camera } from "../../components/render/camera.js";
import { Transform } from "../../components/render/transform.js";
import { System } from "../../ecs/system.js";
import { vec3, mat4, quat } from "gl-matrix";

const temp = vec3.create();
const view = mat4.create();
const rot = quat.create();

class MoveCamera extends System {
  constructor() {
    super([Camera, Transform]);
  }

  apply({ camera, transform }) {
    vec3.sub(temp, camera.target, camera.origin);
    vec3.scale(temp, temp, 0.1);
    vec3.add(camera.origin, temp, camera.origin);
    vec3.add(temp, camera.origin, camera.getOffset());
    mat4.lookAt(view, temp, camera.origin, [0, 1, 0]);
    mat4.getRotation(rot, view);
    //transform.setPosition(temp);
    //transform.setRotation(rot);
  }
}

export { MoveCamera };
