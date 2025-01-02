import { vec3 } from "gl-matrix";
import { Resource } from "../../components/game/resource";
import { Transform } from "../../components/render/transform";
import { System } from "../../ecs/system";
import { Producer } from "../../components/game/producer";

export class PositionResources extends System {
  constructor() {
    super([Transform, Producer]);
  }

  apply({ producer }) {
    const elements = producer.inputs.length + producer.outputs.length;

    for (let i = 0; i < producer.inputs.length; i++) {
      const x = i / elements - 0.5;
      producer.inputs[i]
        .getEntity()
        .components.transform.setPosition(vec3.clone([x, 0.6, 0]));
    }
    for (let i = 0; i < producer.outputs.length; i++) {
      const x = (i + producer.inputs.length + 1) / elements - 0.5;
      producer.outputs[i]
        .getEntity()
        .components.transform.setPosition(vec3.clone([x, 0.6, 0]));
    }
  }
}
