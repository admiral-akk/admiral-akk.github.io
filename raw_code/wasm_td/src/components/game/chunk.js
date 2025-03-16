import { Component } from "../../engine/ecs/component";

export class Chunk extends Component {
  constructor(x, y, trees) {
    super();
    this.x = x;
    this.y = y;
    this.trees = trees;
  }

  removeComponent() {
    for (let i = 0; i < this.trees.length; i++) {
      this.trees[i].deleteEntity();
    }
    super.removeComponent();
  }
}
