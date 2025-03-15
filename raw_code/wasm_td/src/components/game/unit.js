import { Component } from "../../ecs/component";

export class Unit extends Component {
  constructor(pos) {
    super();
    this.pos = pos;
  }
}
