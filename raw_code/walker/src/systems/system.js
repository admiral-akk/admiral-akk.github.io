import { UpdateMeshTransform } from "./render/updateMeshTransform.js";
import { AnimateMeshTransform } from "./render/animateMeshTransform.js";
import { MoveCamera } from "./render/moveCamera.js";
import { ApplyAnimations } from "./render/applyAnimations.js";
import { PositionResources } from "./render/positionResources.js";
import { UpgradePositions } from "./render/upgradePositions.js";
import { UpgradeBuildings } from "./game/upgradeBuildings.js";
import { UpdateResourceActive } from "./render/updateResourceActive.js";
import { CheckProducer } from "./game/checkProducer.js";
import { UpdateInputSatisfied } from "./render/updateInputSatisfied.js";
import { CollectVisibleMeshInstances } from "./render/collectVisibleMeshes.js";

export const meshInstances = new CollectVisibleMeshInstances();

const gameSystems = [new CheckProducer(), new UpgradeBuildings()];

const renderSystems = [
  new MoveCamera(),
  new PositionResources(),
  new UpgradePositions(),
  new UpdateResourceActive(),
  new UpdateInputSatisfied(),
  new AnimateMeshTransform(),
  new ApplyAnimations(),
  new UpdateMeshTransform(),
  meshInstances,
];

const systems = [...gameSystems, ...renderSystems];

export const applySystems = () => {
  for (let systemIndex = 0; systemIndex < systems.length; systemIndex++) {
    systems[systemIndex].run();
  }
};
