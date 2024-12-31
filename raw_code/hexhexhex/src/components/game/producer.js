import { Component } from "../../ecs/component";

// should understand what it's sending output to / recieving input from?
export class Producer extends Component {
  constructor() {
    super();
    this.inputs = [];
    this.outputs = [];
  }
}
