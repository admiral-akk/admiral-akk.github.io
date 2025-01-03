import { Structure } from "../components/game/structure.js";
import { addProducer } from "./addProduction.js";
import { addUpgrade } from "./addUpgrade.js";

export function upgradeBuilding(building, result) {
  // remove the existing building
  if (building.components.upgrade) {
    building.removeComponent(building.components.upgrade);
  }
  if (building.components.production) {
    building.removeComponent(building.components.production);
  }
  if (building.components.building) {
    building.removeComponent(building.components.building);
  }

  for (let i = 0; i < result.production.length; i++) {
    // to do - handle multiple producers?
    addProducer(building, result.production[i]);
  }

  for (let i = 0; i < result.upgrade.length; i++) {
    addUpgrade(building, result.upgrade[i]);
  }

  building.addComponent(new Structure(result.mesh));
}
