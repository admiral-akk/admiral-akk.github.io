import { Component } from "../../ecs/component";
import { Queue } from "../../util/queue";

export class Animations extends Component {
  constructor() {
    this.animationQueue = new Queue();
  }
}
