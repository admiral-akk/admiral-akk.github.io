import { Producer } from "../components/game/producer.js";
import { Input } from "../components/game/input.js";
import { Output } from "../components/game/output.js";
import { addResource } from "./addResource.js";

export const addProducer = (entity, { input, output }) => {
  const producer = new Producer();
  entity.addComponent(producer);
  for (let [type, count] of Object.entries(input)) {
    for (let i = 0; i < count; i++) {
      producer.inputs.push(addResource(type, producer, () => new Input()));
    }
  }
  for (let [type, count] of Object.entries(output)) {
    for (let i = 0; i < count; i++) {
      producer.outputs.push(addResource(type, producer, () => new Output()));
    }
  }
};
