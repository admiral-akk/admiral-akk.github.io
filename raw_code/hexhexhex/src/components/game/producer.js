import { Component } from "../../ecs/component";

// should understand what it's sending output to / recieving input from?
export class Producer extends Component {
  constructor() {
    super();
    this.inputs = [];
    this.outputs = [];
  }

  removeComponent() {
    for (let i = 0; i < this.inputs.length; i++) {
      this.inputs[i].getEntity().deleteEntity();
    }
    for (let i = 0; i < this.outputs.length; i++) {
      this.outputs[i].getEntity().deleteEntity();
    }
    super.removeComponent();
  }
}
