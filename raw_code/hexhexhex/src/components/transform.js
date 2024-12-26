import { vec3, vec4, mat4, quat } from "gl-matrix";
import { Component } from "../ecs/component";

const tempQuat = mat4.create();

class Transform extends Component {
  constructor() {
    super();
    this.updated = true;
    this.pos = vec3.create();

    // identity quaternion
    this.rot = quat.create();

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
    quat.copy(this.rot, rot);
    this.updated = true;
  }

  setScale(scale) {
    vec3.copy(this.scale, scale);
    this.updated = true;
  }

  getMatrix() {
    const mat = mat4.create();

    mat4.translate(mat, mat, this.pos);
    mat4.fromQuat(tempQuat, this.rot);
    mat4.mul(mat, tempQuat, mat);
    mat4.scale(mat, mat, this.scale);

    return mat;
  }
}

export { Transform };
