import { System } from "../../ecs/system";
import { Mesh } from "three";
import { Input } from "../../components/game/input";

export class UpdateInputSatisfied extends System {
  constructor() {
    super([Mesh, Input]);
  }

  apply({ mesh, input }) {
    if (input.sender === null) {
      mesh.setColor([0.5, 0.5, 0.5, 0.5]);
    } else {
      mesh.setColor([1, 1, 1, 1]);
    }
  }
}