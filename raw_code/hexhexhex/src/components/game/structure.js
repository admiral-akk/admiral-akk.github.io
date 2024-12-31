import { Component } from "../../ecs/component";

export class Structure extends Component {
  constructor(pos) {
    super();
    // todo: ugh, need to abstract this out into a seperate "has position" component
    this.pos = pos;
  }
}
