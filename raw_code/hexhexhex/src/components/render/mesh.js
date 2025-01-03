import { Component } from "../../ecs/component";
import { gl } from "../../engine/renderer.js";
import { InstancedMesh } from "../../renderer/instancedMesh";

const instancedMeshes = new Map();

export class Mesh extends Component {
  constructor(modelArray) {
    super();
    if (!instancedMeshes.get(modelArray)) {
      instancedMeshes.set(modelArray, new InstancedMesh(gl, modelArray));
    }
    this.instancedMesh = instancedMeshes.get(modelArray);
    this.visible = true;
    this.updated = true;
  }

  removeComponent() {
    super.removeComponent();
    this.instancedMesh.removeMesh(this);
  }

  setVisible(visible) {
    this.visible = visible;
    this.updated = true;
  }
}
