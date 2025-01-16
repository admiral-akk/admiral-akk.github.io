import { vec3 } from "gl-matrix";
import { Transform } from "../../components/render/transform";
import { System } from "../../ecs/system";
import { Upgrade } from "../../components/game/upgrade";

export class UpgradePositions extends System {
  constructor() {
    super([Transform, Upgrade]);
  }

  apply({ upgrade }) {
    const elements = upgrade.inputs.length;

    for (let i = 0; i < upgrade.inputs.length; i++) {
      const x = i / elements - 0.5;
      upgrade.inputs[i]
        .getEntity()
        .components.transform.setPosition(vec3.clone([x, 0.6, 0]));
    }
  }
}
