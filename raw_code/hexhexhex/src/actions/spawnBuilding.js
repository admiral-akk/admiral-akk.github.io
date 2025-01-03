import { Resource } from "../components/game/resource";
import { resources } from "../resource";
import { Structure } from "../components/game/structure.js";
import { Producer } from "../components/game/producer.js";
import { Clickable } from "../components/client/clickable.js";
import { Coordinate } from "../components/game/coordinate.js";
import { Option } from "../components/game/option.js";
import { Input } from "../components/game/input.js";
import { Output } from "../components/game/output.js";
import { Upgrade } from "../components/game/upgrade.js";
import { Entity, getEntitiesWith } from "../ecs/entity.js";
import { Mesh } from "../components/render/mesh.js";
import { Transform } from "../components/render/transform.js";
import { vec3 } from "gl-matrix";
import { BoxCollider } from "../components/collider.js";

const addResource = (type, producer, inputOutputCallback) => {
  const mesh = resources[type].mesh;
  const r = new Resource(type);
  new Entity(
    new Mesh(mesh),
    r,
    new Transform({ parent: producer.getEntity().components.transform }),
    new BoxCollider([0.1, 0.1, 0.1]),
    new Clickable(),
    inputOutputCallback()
  );
  return r;
};

const addProducer = (entity, { input, output }) => {
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

const addUpgrade = (entity, { input, result }) => {
  const upgrade = new Upgrade(result);
  entity.addComponent(upgrade);
  for (let [type, count] of Object.entries(input)) {
    for (let i = 0; i < count; i++) {
      upgrade.inputs.push(addResource(type, upgrade, () => new Input()));
    }
  }
};

export function spawnBuilding(hexEntity, building) {
  const { coordinate, transform } = hexEntity.components;
  const e = new Entity(
    new Transform({ parent: transform, pos: vec3.clone([0, 0.25, 0]) }),
    new Structure(),
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
  return e;
}
