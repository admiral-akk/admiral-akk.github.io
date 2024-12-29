import { Component } from "../ecs/component";

class Unit extends Component {
  constructor(startPos) {
    super();
    this.pos = startPos;
    this.movingTo = null;
    this.moveStart = null;
  }

  moveTo(target) {
    if (this.moveStart === null) {
      return;
    }
    this.movingTo = target;
    this.moveStart = Date.now();
  }
}

export { Unit };
