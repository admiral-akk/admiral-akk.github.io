import { Component } from "../../ecs/component";
import { getInstancedMesh } from "../../renderer/instancedMesh";

export class Mesh extends Component {
  constructor(modelArray) {
    super();
    this.instancedMesh = getInstancedMesh(modelArray);
    this.visible = true;
    this.updated = true;
    this.metadata = new Float32Array(16);
    this.metadata.set([1, 1, 1, 1]);
    this.instancedMesh.createMesh(this);
  }

  getAABB(transform) {
    return this.instancedMesh.getAABB(this, transform);
  }

  removeComponent() {
    super.removeComponent();
    this.instancedMesh.deleteMesh(this);
  }

  setVisible(visible) {
    this.visible = visible;
    this.updated = true;
  }

  setMetadata(values, offset = 0) {
    this.metadata.set(values, offset);
    this.updated = true;
  }
}
