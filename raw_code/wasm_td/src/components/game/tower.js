import { Component } from "../../ecs/component";

export class Tower extends Component {
  constructor(pos) {
    super();
    this.pos = pos;
  }
}
