import { mat4, vec3 } from "gl-matrix";
import { Component } from "../../ecs/component";

export class Camera extends Component {
  constructor(gl) {
    super();

    this.distance = 6;
    this.xAngle = 0;
    this.yAngle = Math.PI / 4;

    this.origin = vec3.create();
    this.target = vec3.create();

    this.near = 0.01;
    this.far = 80.0;

    this.projection = mat4.create();
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
