import { Component } from "../ecs/component";

class Hex extends Component {
  constructor(coords, dim) {
    super();
    this.coords = coords;
    this.dim = dim;
  }
}

export { Hex };
