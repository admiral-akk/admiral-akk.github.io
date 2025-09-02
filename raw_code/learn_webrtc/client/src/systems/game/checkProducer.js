import { vec3 } from "gl-matrix";
import { Resource } from "../../components/game/resource";
import { Transform } from "../../components/render/transform";
import { System } from "../../ecs/system";
import { Producer } from "../../components/game/producer";
import { Mesh } from "three";
import { Output } from "../../components/game/output";

export class CheckProducer extends System {
  constructor() {
    super([Producer]);
  }

  apply({ producer }) {
    const anyUnsatisfied = producer.inputs.some(
      (v) => v.getEntity().components.input.sender === null
    );
    producer.outputs.forEach((o) => {
      o.getEntity().components.output.setActive(!anyUnsatisfied);
    });
  }
}
