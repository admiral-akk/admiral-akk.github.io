import { vec4 } from "gl-matrix";
import { Component } from "../../ecs/component";
import { getInstancedMesh } from "../../renderer/instancedMesh";

export class Mesh extends Component {
  constructor(modelArray) {
    super();
    this.instancedMesh = getInstancedMesh(modelArray);
    this.visible = true;
    this.updated = true;
    this.color = vec4.clone([1, 1, 1, 1]);
  }

  removeComponent() {
    super.removeComponent();
    this.instancedMesh.removeMesh(this);
  }

  setVisible(visible) {
    this.visible = visible;
    this.updated = true;
  }

  setColor(color) {
    this.color = vec4.clone(color);
    this.updated = true;
  }
}
