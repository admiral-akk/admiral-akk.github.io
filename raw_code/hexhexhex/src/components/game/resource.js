import { Component } from "../../ecs/component";

export class Resource extends Component {
  constructor(type) {
    super();
    this.type = type;
  }
}
