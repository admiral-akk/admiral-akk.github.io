import { mat4 } from "gl-matrix";
import { Component } from "../../ecs/component";

class Mesh extends Component {
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

export { Mesh };
