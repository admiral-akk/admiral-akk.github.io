import { Structure } from "../components/game/structure.js";
import { addProducer } from "./addProduction.js";
import { addUpgrade } from "./addUpgrade.js";
import { Entity } from "../ecs/entity.js";
import { vec3 } from "gl-matrix";
import { Mesh } from "../components/render/mesh.js";
import { Transform } from "../components/render/transform.js";

export function upgradeBuilding(building, result) {
  // remove the existing building
  if (building.components.upgrade) {
    building.removeComponent(building.components.upgrade);
  }
  if (building.components.production) {
    building.removeComponent(building.components.production);
  }
  if (building.components.structure) {
    building.removeComponent(building.components.structure);
  }

  for (let i = 0; i < result.production.length; i++) {
    // to do - handle multiple producers?
    addProducer(building, result.production[i]);
  }

  for (let i = 0; i < result.upgrade.length; i++) {
    addUpgrade(building, result.upgrade[i]);
  }

  const m = new Entity(
    new Transform({
      parent: building.components.transform,
      pos: vec3.clone([0.2, 0, 0]),
    }),
    new Mesh(result.mesh)
  );

  building.addComponent(new Structure(m));
}
