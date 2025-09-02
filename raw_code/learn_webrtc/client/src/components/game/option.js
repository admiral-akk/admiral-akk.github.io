import { Component } from "../../ecs/component";

export class Option extends Component {
  constructor(target, result) {
    super();
    this.target = target;
    this.result = result;
  }
}
