import { Connection } from "../components/render/connection.js";
import { Entity } from "../ecs/entity.js";
import { generateLineMesh } from "../renderer/mesh.js";
import { Mesh } from "../components/render/mesh.js";
import { Transform } from "../components/render/transform.js";
import { vec3 } from "gl-matrix";

const lineMesh = generateLineMesh(10);

export const addLine = (startEntity, endEntity) => {
  const startTransform = startEntity.components.transform;
  const color = startEntity.components.mesh.metadata.slice(0, 4);
  console.log(color);
  const endTransform = endEntity.components.transform;
  const start = startTransform.getWorldPosition();
  const end = endTransform.getWorldPosition();
  const l = new Mesh(lineMesh);
  l.setMetadata([...color, ...start, 1, ...end, 1]);
  const e = new Entity(
    new Connection(startEntity, endEntity),
    l,
    new Transform()
  );
  console.log(e);
};
