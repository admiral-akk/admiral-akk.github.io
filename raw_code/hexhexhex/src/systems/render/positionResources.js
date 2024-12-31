import { vec3 } from "gl-matrix";
import { Resource } from "../../components/game/resource";
import { Transform } from "../../components/render/transform";
import { System } from "../../ecs/system";

export class PositionResources extends System {
  constructor() {
    super([Transform, Resource]);
  }

  apply({ resource, transform }) {
    const inputIndex = resource.producer.inputs.indexOf(resource);
    const outputIndex = resource.producer.outputs.indexOf(resource);

    const elements =
      resource.producer.inputs.length + resource.producer.outputs.length;

    const order =
      Math.max(inputIndex, outputIndex) +
      (inputIndex === -1 ? resource.producer.inputs.length + 1 : 0);

    const x = order / elements - 0.5;

    transform.setPosition(vec3.clone([x, 0.6, 0]));
  }
}
