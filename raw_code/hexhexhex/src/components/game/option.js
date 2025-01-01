import { Component } from "../../ecs/component";

export class Option extends Component {
  constructor(target) {
    super();
    this.target = target;
  }
}
