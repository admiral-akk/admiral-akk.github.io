import { Component } from "../../engine/ecs/component";

export class Chunk extends Component {
  constructor(trees) {
    super();
    this.trees = trees;
  }

  removeComponent() {
    for (let i = 0; i < this.trees.length; i++) {
      this.trees[i].deleteEntity();
    }
    super.removeComponent();
  }
}
