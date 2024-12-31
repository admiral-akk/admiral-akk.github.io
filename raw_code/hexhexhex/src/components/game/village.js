import { Component } from "../../ecs/component";

export class Village extends Component {
  constructor(pos) {
    super();
    this.pos = pos;
  }
}
