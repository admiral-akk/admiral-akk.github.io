import { Component } from "../../ecs/component";

export class Upgrade extends Component {
  constructor(resultId) {
    super();
    this.inputs = [];
    this.resultId = resultId;
  }
}
