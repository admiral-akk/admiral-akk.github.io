import { Component } from "../../ecs/component";

const hexMap = new Map();

class Hex extends Component {
  static get(coords) {
    return hexMap.get(`${coords[0]},${coords[1]}`);
  }

  constructor(coords) {
    super();
    this.coords = coords;
    hexMap.set(`${coords[0]},${coords[1]}`, this);
  }

  removeComponent() {
    super.removeComponent();
    hexMap.delete(`${this.coords[0]},${this.coords[1]}`);
  }
}

export { Hex };