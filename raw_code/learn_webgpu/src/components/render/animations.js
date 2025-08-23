import { Component } from "../../ecs/component";

export class Animation {
  constructor(start, end, animation) {
    this.start = start;
    this.end = end;
    this.animation = animation;
  }
  apply(time) {
    const t = (time - this.start) / (this.end - this.start);
    if (t > 1) {
      this.animation(1);
      return true;
    } else if (t >= 0) {
      this.animation(t);
    }
    return false;
  }
}

export class Animated extends Component {
  constructor() {
    super();
    this.animations = [];
  }
}
