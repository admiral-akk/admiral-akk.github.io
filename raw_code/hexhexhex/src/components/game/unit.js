import { Component } from "../../ecs/component";

class Unit extends Component {
  constructor(startPos) {
    super();
    this.pos = startPos;
    this.animationStack = [];
  }

  moveTo(target) {
    const start = this.animationStack.peek() ?? [
      null,
      Date.now(),
      null,
      this.pos,
    ];
    this.pos = target;
    this.animationStack.push([start[1], start[1] + 1000, start[3], target]);
  }
}

export { Unit };
