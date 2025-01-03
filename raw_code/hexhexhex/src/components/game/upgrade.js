import { Component } from "../../ecs/component";

export class Upgrade extends Component {
  constructor(result) {
    super();
    this.inputs = [];
    this.result = result;
  }

  removeComponent() {
    for (let i = 0; i < this.inputs.length; i++) {
      this.inputs[i].getEntity().deleteEntity();
    }
    super.removeComponent();
  }
}
