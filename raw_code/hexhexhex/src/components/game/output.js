import { Component } from "../../ecs/component";

export class Output extends Component {
  constructor() {
    super();
    this.reciever = null;
    this.active = false;
  }

  disconnect() {
    if (this.reciever) {
      this.reciever.sender = null;
      this.reciever = null;
    }
  }

  connect(reciever) {
    this.reciever = reciever;
    reciever.connect(this);
  }

  removeComponent() {
    this.disconnect();
    super.removeComponent();
  }
}
