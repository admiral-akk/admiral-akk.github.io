import { Clickable } from "../components/client/clickable.js";
import { Entity } from "../ecs/entity.js";
import { Mesh } from "../components/render/mesh.js";
import { Transform } from "../components/render/transform.js";
import { BoxCollider } from "../components/collider.js";
import { Structure } from "../components/game/structure.js";
import { Option } from "../components/game/option.js";
import { vec3 } from "gl-matrix";

const optionSize = 0.1;

export function addOption(hexEntity, blueprint) {
  const o = new Entity(
    new BoxCollider([2 * optionSize, 2 * optionSize, 2 * optionSize]),
    new Clickable(),
    new Option(hexEntity, blueprint),
    new Transform({
      parent: hexEntity.components.transform,
      pos: vec3.clone([0, 0.4, 0]),
    })
  );
  const m = new Entity(
    new Mesh(blueprint.option),
    new Transform({
      parent: o.components.transform,
    })
  );
  o.addComponent(new Structure(m));
}
