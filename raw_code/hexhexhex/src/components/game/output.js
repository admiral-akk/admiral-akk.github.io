import { Component } from "../../ecs/component";

export class Output extends Component {
  constructor() {
    super();
    this.reciever = null;
  }

  disconnect() {
    this.reciever.sender = null;
    this.reciever = null;
  }

  connect(reciever) {
    this.reciever = reciever;
    reciever.connect(this);
  }
}