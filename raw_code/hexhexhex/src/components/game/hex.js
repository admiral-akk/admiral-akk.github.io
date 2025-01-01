import { Component } from "../../ecs/component";

export class Hex extends Component {
  constructor(coords) {
    super();
    this.coords = coords;
  }
}
