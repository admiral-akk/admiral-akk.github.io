import { mat4 } from "gl-matrix";
import { Component } from "../ecs/component";

class Mesh extends Component {
  constructor(gl, instancedMesh) {
    super();
    this.instancedMesh = instancedMesh;
    this.index = instancedMesh.addMesh(gl, this);
  }

  updateIndex(index) {
    this.index = index;
  }

  updatePosition(gl, newPos) {
    const newMat = mat4.create();
    mat4.translate(newMat, newMat, newPos);
    this.instancedMesh.updateTransform(this.index, newMat);
  }
}

export { Mesh };
