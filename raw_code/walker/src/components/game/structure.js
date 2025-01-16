import { Component } from "../../ecs/component";

export class Structure extends Component {
  constructor(meshEntity) {
    super();
    this.mesh = meshEntity;
  }

  removeComponent() {
    this.mesh.deleteEntity();
    super.removeComponent();
  }
}
