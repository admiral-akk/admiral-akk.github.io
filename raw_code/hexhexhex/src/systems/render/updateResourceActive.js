import { System } from "../../ecs/system";
import { Mesh } from "three";
import { Output } from "../../components/game/output";

export class UpdateResourceActive extends System {
  constructor() {
    super([Mesh, Output]);
  }

  apply({ mesh, output }) {
    if (!output.active) {
      mesh.setColor([0.5, 0.5, 0.5, 0.5]);
    } else {
      mesh.setColor([1, 1, 1, 1]);
    }
  }
}
