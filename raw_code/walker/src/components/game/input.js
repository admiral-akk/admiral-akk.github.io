import { Component } from "../../ecs/component";

export class Input extends Component {
  constructor() {
    super();
    this.sender = null;
  }

  connect(sender) {
    this.sender?.disconnect();
    this.sender = sender;
  }

  removeComponent() {
    this.sender?.disconnect();
    super.removeComponent();
  }
}
