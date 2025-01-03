import { Component } from "../../ecs/component";

export class Upgrade extends Component {
  constructor(result) {
    super();
    this.inputs = [];
    this.result = result;
  }
}
