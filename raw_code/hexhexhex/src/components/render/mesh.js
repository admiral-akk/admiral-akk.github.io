import { Component } from "../../ecs/component";

export class Mesh extends Component {
  constructor(instancedMesh) {
    super();
    this.instancedMesh = instancedMesh;
    this.visible = true;
    this.updated = true;
  }

  setVisible(visible) {
    this.visible = visible;
    this.updated = true;
  }
}
