import { Component } from "../../ecs/component";

const coordToEntities = new Map();

export class Coordinate extends Component {
  constructor(pos) {
    super();
    this.pos = pos;
  }

  static getEntities(coords) {
    return coordToEntities.get(`${coords[0]},${coords[1]}`) ?? [];
  }

  addComponent(entity) {
    super.addComponent(entity);
    const key = `${this.pos[0]},${this.pos[1]}`;
    if (!coordToEntities.has(key)) {
      coordToEntities.set(key, []);
    }
    const arr = coordToEntities.get(key);
    arr.push(this.getEntity());
  }

  removeComponent() {
    // need to use getEntity first.
    coordToEntities.get(key).delete(this.getEntity());
    super.removeComponent();
  }
}
