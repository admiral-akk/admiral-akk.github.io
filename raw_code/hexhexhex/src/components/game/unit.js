import { Component } from "../../ecs/component";
import { Position } from "../../systems/util/position";
import { Queue } from "../../util/queue";

export class Unit extends Component {
  constructor(startPos) {
    super();
    this.pos = startPos;
    this.animationStack = new Queue();
  }

  moveTo(target) {
    const finalAnimation = this.animationStack.back();
    var [_, endTime, __, ___] =
      finalAnimation !== undefined
        ? finalAnimation
        : [null, Date.now(), null, this.pos];
    const path = Position.path(this.pos, target);
    for (let i = 0; i < path.length - 1; i++) {
      this.animationStack.queue([
        endTime,
        endTime + 1000,
        path[i],
        path[i + 1],
      ]);
      endTime += 1000;
    }
    this.pos = target;
  }
}
