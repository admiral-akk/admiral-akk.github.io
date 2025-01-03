import { Structure } from "../components/game/structure.js";
import { Coordinate } from "../components/game/coordinate.js";
import { Option } from "../components/game/option.js";
import { Entity, getEntitiesWith } from "../ecs/entity.js";
import { Mesh } from "../components/render/mesh.js";
import { Transform } from "../components/render/transform.js";
import { vec3 } from "gl-matrix";
import { addProducer } from "./addProduction.js";
import { addUpgrade } from "./addUpgrade.js";

export function spawnBuilding(hexEntity, building) {
  const { coordinate, transform } = hexEntity.components;
  const e = new Entity(
    new Transform({ parent: transform, pos: vec3.clone([0, 0.25, 0]) }),
    new Coordinate(coordinate.pos)
  );
  for (let i = 0; i < building.production.length; i++) {
    // to do - handle multiple producers?
    addProducer(e, building.production[i]);
  }

  for (let i = 0; i < building.upgrade.length; i++) {
    addUpgrade(e, building.upgrade[i]);
  }

  // remove all of the options for the hex
  getEntitiesWith(Option, Structure)
    .filter((ent) => {
      return ent.components.option.target === hexEntity;
    })
    .forEach((ent) => ent.deleteEntity());

  const m = new Entity(
    new Transform({
      parent: e.components.transform,
      pos: vec3.clone([0.2, 0, 0]),
    }),
    new Mesh(building.mesh)
  );
  e.addComponent(new Structure(m));
  return e;
}
