import { Input } from "../components/game/input.js";
import { Upgrade } from "../components/game/upgrade.js";
import { addResource } from "./addResource.js";

export const addUpgrade = (entity, { input, result }) => {
  const upgrade = new Upgrade(result);
  entity.addComponent(upgrade);
  for (let [type, count] of Object.entries(input)) {
    for (let i = 0; i < count; i++) {
      upgrade.inputs.push(addResource(type, upgrade, () => new Input()));
    }
  }
};
