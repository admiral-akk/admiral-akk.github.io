import { Component } from "../../ecs/component";
import { Queue } from "../../util/queue";

class Unit extends Component {
  constructor(startPos) {
    super();
    this.pos = startPos;
    this.animationStack = new Queue();
  }

  moveTo(target) {
    const finalAnimation = this.animationStack.back();
    console.log(finalAnimation);
    const [_, endTime, __, endPos] =
      finalAnimation !== undefined
        ? finalAnimation
        : [null, Date.now(), null, this.pos];
    this.pos = target;
    this.animationStack.queue([endTime, endTime + 1000, endPos, target]);
  }
}

export { Unit };
