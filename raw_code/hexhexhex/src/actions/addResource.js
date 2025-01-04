import { Resource } from "../components/game/resource";
import { resources } from "../resource";
import { Clickable } from "../components/client/clickable.js";
import { Entity } from "../ecs/entity.js";
import { Mesh } from "../components/render/mesh.js";
import { Transform } from "../components/render/transform.js";
import { BoxCollider } from "../components/collider.js";

export const addResource = (type, producer, inputOutputCallback) => {
  const mesh = resources[type].mesh;
  const r = new Resource(type);
  const m = new Mesh(mesh);
  m.setMetadata(resources[type].color);
  console.log(resources[type].color, m);
  new Entity(
    m,
    r,
    new Transform({ parent: producer.getEntity().components.transform }),
    new BoxCollider([0.1, 0.1, 0.1]),
    new Clickable(),
    inputOutputCallback()
  );
  return r;
};
