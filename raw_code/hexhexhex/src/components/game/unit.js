import { Component } from "../../ecs/component";

export class Unit extends Component {
  constructor(startPos) {
    super();
    this.pos = startPos;
  }

  moveTo(target) {
    this.pos = target;
  }
}
