import { vec3, mat4, quat } from "gl-matrix";
import { Component } from "../../ecs/component";

const tempQuat = mat4.create();

const recursiveWorld = (transform, acc) => {
  if (transform.parent === null) {
    mat4.copy(acc, transform.getLocalMatrix());
  } else {
    recursiveWorld(transform.parent, acc);
    mat4.multiply(acc, acc, transform.getLocalMatrix());
  }
};

export class Transform extends Component {
  constructor({ parent = null, pos = null, rot = null, scale = null } = {}) {
    super();
    this.updated = true;
    this.pos = pos ?? vec3.create();

    // identity quaternion
    this.rot = rot ?? quat.create();

    this.scale = scale ?? vec3.clone([1, 1, 1]);

    this.parent = parent;

    this.matrix = mat4.create();
  }

  getWorldMatrix() {
    if (this.parent === null) {
      return this.getLocalMatrix();
    }

    const worldMat = mat4.create();

    recursiveWorld(this.parent, worldMat);
    mat4.multiply(worldMat, worldMat, this.getLocalMatrix());

    return worldMat;
  }

  getLocalMatrix() {
    if (!this.updated) {
      return this.matrix;
    }

    this.updated = false;
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
