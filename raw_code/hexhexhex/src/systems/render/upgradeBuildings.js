import { System } from "../../ecs/system";
import { Upgrade } from "../../components/game/upgrade";
import { upgradeBuilding } from "../../actions/upgradeBuilding";

export class UpgradeBuildings extends System {
  constructor() {
    super([Upgrade]);
  }

  apply({ upgrade }, building) {
    console.log(building);
    console.log(upgrade);
    const anyUnsatisfied = upgrade.inputs.some(
      (v) => v.getEntity().components.input.sender === null
    );

    if (!anyUnsatisfied) {
      upgradeBuilding(building, upgrade.result);
    }
  }
}
