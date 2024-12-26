import { mat4, vec3 } from "gl-matrix";
import { Component } from "../ecs/component";

class Camera extends Component {
  constructor(gl) {
    super();
    this.offset = vec3.create();
    this.offset[0] = 4;
    this.offset[1] = 4;

    this.origin = vec3.create();
    this.target = vec3.create();

    const fov = Math.PI / 2;
    const aspect = gl.canvas.width / gl.canvas.height;
    const near = 0.01;
    const far = 20;

    this.projection = mat4.create();
    mat4.perspective(this.projection, fov, aspect, near, far);
  }

  setTarget(pos) {
    vec3.copy(this.target, pos);
  }

  setOrigin(pos) {
    vec3.copy(this.origin, pos);
  }
}

export { Camera };
