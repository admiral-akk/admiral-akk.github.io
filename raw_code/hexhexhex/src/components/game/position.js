import { Component } from "../../ecs/component";

export class Position extends Component {
  constructor(pos) {
    super();
    this.pos = pos;
  }
}
