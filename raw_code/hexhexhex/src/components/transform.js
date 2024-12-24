import { vec3, vec4, mat4 } from "gl-matrix";
import { Component } from "../ecs/component";

const tempQuat = mat4.create();

class Transform extends Component {
  constructor() {
    super();
    this.updated = true;
    this.pos = vec3.create();

    // identity quaternion
    this.rot = vec4.create();
    this.rot[3] = 1;

    this.scale = vec3.create();
    this.scale[0] = 1;
    this.scale[1] = 1;
    this.scale[2] = 1;
  }

  setPosition(pos) {
    vec3.copy(this.pos, pos);
    this.updated = true;
  }

  setRotation(rot) {
    vec4.copy(this.rot, rot);
    this.updated = true;
  }

  setScale(scale) {
    vec3.copy(this.scale, scale);
    this.updated = true;
  }

  getMatrix() {
    const mat = mat4.create();

    mat4.scale(mat, mat, this.scale);
    mat4.fromQuat(tempQuat, this.rot);
    mat4.mul(mat, tempQuat, mat);
    mat4.translate(mat, mat, this.pos);

    return mat;
  }
}

export { Transform };
