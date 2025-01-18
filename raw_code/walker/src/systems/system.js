import { UpdateMeshTransform } from "./render/updateMeshTransform.js";
import { MoveCamera } from "./render/moveCamera.js";
import { ApplyAnimations } from "./render/applyAnimations.js";
import { RotateMeshes } from "./render/rotateMeshes.js";
import { CollectVisibleMeshInstances } from "./render/collectVisibleMeshes.js";

export const meshInstances = new CollectVisibleMeshInstances();

const gameSystems = [];

const renderSystems = [
  new MoveCamera(),
  new ApplyAnimations(),
  new RotateMeshes(),
  new UpdateMeshTransform(),
  meshInstances,
];

const systems = [...gameSystems, ...renderSystems];

export const applySystems = () => {
  for (let systemIndex = 0; systemIndex < systems.length; systemIndex++) {
    systems[systemIndex].run();
  }
};
