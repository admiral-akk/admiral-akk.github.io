import { Component } from "../../ecs/component";

export class Connection extends Component {
  constructor(start, end) {
    super();
    this.start = start;
    this.end = end;
  }
}
