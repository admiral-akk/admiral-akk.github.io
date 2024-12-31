import { Component } from "../../ecs/component";

export class Resource extends Component {
  constructor(type, producer) {
    super();
    this.type = type;
    this.producer = producer;
    this.destinationComponent = null;
  }
}
