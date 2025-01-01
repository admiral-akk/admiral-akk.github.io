import { Component } from "../../ecs/component";

const coordToEntities = new Map();

export class Coordinate extends Component {
  constructor(pos) {
    super();
    this.pos = pos;
    const key = `${pos[0]},${pos[1]}`;
    if (!coordToEntities.has(key)) {
      coordToEntities.set(key, []);
    }
    const arr = coordToEntities.get(key);
    arr.push(this.getEntity());
  }

  static getEntities(coords) {
    return coordToEntities.get(`${coords[0]},${coords[1]}`);
  }

  removeComponent() {
    // need to use getEntity first.
    coordToEntities.get(key).delete(this.getEntity());
    super.removeComponent();
  }
}
