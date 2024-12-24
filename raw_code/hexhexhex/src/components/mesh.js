import { mat4 } from "gl-matrix";

class Mesh {
  constructor(instancedMesh) {
    this.instancedMesh = instancedMesh;
    this.index = instancedMesh.addMesh(this);
  }

  updateIndex(index) {
    this.index = index;
  }

  updatePosition(gl, newPos) {
    const newMat = mat4.create();
    mat4.translate(newMat, newMat, newPos);
    this.instancedMesh.updateTransform(gl, this.index, newMat);
  }
}

export { Mesh };
