import { mat4, vec3 } from "gl-matrix";
import { Component } from "../../ecs/component";

class Camera extends Component {
  constructor(gl) {
    super();

    this.distance = 6;
    this.xAngle = 0;
    this.yAngle = Math.PI / 4;

    this.origin = vec3.create();
    this.target = vec3.create();

    const fov = Math.PI / 3;
    const aspect = gl.canvas.width / gl.canvas.height;
    const near = 0.01;
    const far = 20;

    this.projection = mat4.create();
    mat4.perspective(this.projection, fov, aspect, near, far);
  }

  getOffset() {
    return vec3.clone([
      this.distance * Math.sin(this.xAngle) * Math.cos(this.yAngle),
      this.distance * Math.sin(this.yAngle),
      this.distance * Math.cos(this.xAngle) * Math.cos(this.yAngle),
    ]);
  }

  setTarget(pos) {
    vec3.copy(this.target, pos);
  }

  setOrigin(pos) {
    vec3.copy(this.origin, pos);
  }
}

export { Camera };
