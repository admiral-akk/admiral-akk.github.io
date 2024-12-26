import { vec3, mat4, quat } from "gl-matrix";
import { Component } from "../ecs/component";

const tempQuat = mat4.create();

const recursiveWorld = (transform, acc) => {
  if (transform.parent === null) {
    mat4.copy(acc, transform.getLocalMatrix());
  } else {
    recursiveWorld(transform.parent, acc);
    mat4.multiply(acc, acc, transform.getLocalMatrix());
  }
};

class Transform extends Component {
  constructor(parent = null) {
    super();
    this.updated = true;
    this.pos = vec3.create();

    // identity quaternion
    this.rot = quat.create();

    this.scale = vec3.create();
    this.scale[0] = 1;
    this.scale[1] = 1;
    this.scale[2] = 1;

    this.parent = parent;

    this.matrix = mat4.create();
    if (this.parent !== null) {
      // we haven't copied the parent's matrix down.
      // wait, what if the parent changes, but the child doesn't?

      // have to traverse the full chain?
      this.updated = true;
    }
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

  updateMatrix() {
    if (!this.updated) {
      return;
    }

    this.updated = false;

    if (this.parent !== null) {
      mat4.copy(this.parent.getMatrix(), this.parent.matrix);
    } else {
      mat4.identity(this.matrix);
    }

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

export { Transform };
