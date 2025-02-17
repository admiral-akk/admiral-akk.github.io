import { vec2 } from "gl-matrix";
import { Component } from "../../ecs/component";

export class Position extends Component {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }

  static adjacent([x, y]) {
    const offset = x % 2 === 0 ? 0 : -1;
    return [
      [x, y + 1],
      [x, y - 1],
      [x + 1, y + offset],
      [x + 1, y + 1 + offset],
      [x - 1, y + offset],
      [x - 1, y + 1 + offset],
    ];
  }

  static path(start, end) {
    const path = [start];

    while (vec2.distance(path[path.length - 1], end) > 0.5) {
      const neighbours = Position.adjacent(path[path.length - 1]);
      const closest = neighbours.min((v) => vec2.distance(v, end));
      path.push(closest);
    }
    return path;
  }
}
