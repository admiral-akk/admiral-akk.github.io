import { Camera } from "../../components/render/camera.js";
import { Transform } from "../../components/render/transform.js";
import { System } from "../../ecs/system.js";
import { gl } from "../../engine/renderer.js";
import { AABB } from "../../engine/aabb.js";
import { Mesh } from "../../components/render/mesh.js";
import { Position } from "../util/position.js";
import { Entity, getEntitiesWith } from "../../ecs/entity.js";
import { Vec3 } from "gl-matrix";

const chunkSize = 20;
let activeTerrainGenerator = null;

class GenerateChunks extends System {
  constructor() {
    super([Camera, Transform]);
  }

  static setTerrainGenerator(t) {
    activeTerrainGenerator = t;
  }

  apply({ camera, transform }) {
    const frustumAABB = new AABB(camera.getFrustumCorners(gl));

    const maxX = Math.ceil(frustumAABB.max[0] / chunkSize);
    const maxY = Math.ceil(frustumAABB.max[2] / chunkSize);
    const minX = Math.floor(frustumAABB.min[0] / chunkSize);
    const minY = Math.floor(frustumAABB.min[2] / chunkSize);

    const chunks = getEntitiesWith(...[Mesh, Position]);

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const exists = chunks.some((v) => {
          const position = v.components.position;
          return position.x === x && position.y === y;
        });
        if (!exists) {
          new Entity(
            new Transform({ pos: Vec3.clone([x * 20, 0, y * 20]) }),
            new Mesh(activeTerrainGenerator.generate_mesh(x, y)),
            new Position(x, y)
          );
        }
      }
    }
  }
}

export { GenerateChunks };
