import { Component } from "../../ecs/component";

export class Coordinate extends Component {
  constructor(pos) {
    super();
    this.pos = pos;
  }
}
