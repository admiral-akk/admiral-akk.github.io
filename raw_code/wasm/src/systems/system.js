import { UpdateMeshTransform } from "./render/updateMeshTransform.js";
import { MoveCamera } from "./render/moveCamera.js";
import { ApplyAnimations } from "./render/applyAnimations.js";
import { CollectVisibleMeshInstances } from "./render/collectVisibleMeshes.js";
import { FrustumCulling } from "./render/frustumCulling.js";
import { GenerateChunks } from "./render/generateChunks.js";

export const meshInstances = new CollectVisibleMeshInstances();

const gameSystems = [];

const renderSystems = [
  new MoveCamera(),
  new ApplyAnimations(),
  new GenerateChunks(),
  new UpdateMeshTransform(),
  new FrustumCulling(),
  meshInstances,
];

export const applySystems = () => {
  for (let systemIndex = 0; systemIndex < gameSystems.length; systemIndex++) {
    gameSystems[systemIndex].run();
  }
  for (let systemIndex = 0; systemIndex < renderSystems.length; systemIndex++) {
    renderSystems[systemIndex].run();
  }
};
