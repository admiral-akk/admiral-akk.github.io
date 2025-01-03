import { Component } from "../../ecs/component";
import { gl } from "../../engine/renderer.js";
import { InstancedMesh } from "../../renderer/instancedMesh";

const instancedMeshes = new Map();

export class Mesh extends Component {
  constructor(arr) {
    super();
    if (!instancedMeshes.get(arr)) {
      const [mesh, program] = arr;
      instancedMeshes.set(arr, new InstancedMesh(gl, mesh, program));
    }
    this.instancedMesh = instancedMeshes.get(arr);
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
