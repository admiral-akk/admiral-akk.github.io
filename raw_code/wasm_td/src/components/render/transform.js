import { vec3, mat4, quat, Vec3, Quat, Mat4, Vec4 } from "gl-matrix";
import { Component } from "../../engine/ecs/component";

const tempQuat = mat4.create();

const recursiveWorld = (transform, acc) => {
  if (transform.parent !== null) {
    recursiveWorld(transform.parent, acc);
    mat4.multiply(acc, transform.getLocalMatrix(), acc);
  } else {
    mat4.copy(acc, transform.getLocalMatrix());
  }
};

export class Transform extends Component {
  constructor({ parent = null, pos = null, rot = null, scale = null } = {}) {
    super();
    this.updated = true;
    this.pos = pos ?? Vec3.create();

    // identity quaternion
    this.rot = rot ?? Quat.create();

    this.scale = scale ?? Vec3.clone([1, 1, 1]);

    this.parent = parent;

    this.matrix = Mat4.create();
  }

  getWorldPosition() {
    const pos = Vec4.clone([0, 0, 0, 1]);
    const mat = this.getWorldMatrix();
    mat4.invert(mat, mat);
    Vec4.transformMat4(pos, pos, mat);
    return pos;
  }

  getWorldMatrix() {
    const worldMat = mat4.create();

    recursiveWorld(this, worldMat);

    return worldMat;
  }

  getLocalMatrix() {
    mat4.identity(this.matrix);

    mat4.translate(this.matrix, this.matrix, this.pos);
    mat4.fromQuat(tempQuat, this.rot);
    mat4.mul(this.matrix, tempQuat, this.matrix);
    mat4.scale(this.matrix, this.matrix, this.scale);

    return this.matrix;
  }

  setParent(parent) {
    this.parent = parent;
    this.updated = true;
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
}
