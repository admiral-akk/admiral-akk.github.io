import { Structure } from "../components/game/structure.js";
import { addProducer } from "./addProduction.js";
import { addUpgrade } from "./addUpgrade.js";

export function upgradeBuilding(building, result) {
  // remove the existing building
  building.components.upgrade?.removeComponent();
  building.components.production?.removeComponent();
  building.components.building?.removeComponent();

  for (let i = 0; i < result.production.length; i++) {
    // to do - handle multiple producers?
    addProducer(building, result.production[i]);
  }

  for (let i = 0; i < result.upgrade.length; i++) {
    addUpgrade(building, result.upgrade[i]);
  }

  building.addComponent(new Structure(result.mesh));
}
