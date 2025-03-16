import { Camera } from "../../components/render/camera.js";
import { Transform } from "../../components/render/transform.js";
import { System } from "../../engine/ecs/system.js";
import { gl } from "../../engine/renderer.js";
import { AABB } from "../../engine/aabb.js";
import { Mesh } from "../../components/render/mesh.js";
import { Entity, getEntitiesWith } from "../../engine/ecs/entity.js";
import { Vec3 } from "gl-matrix";
import { Chunk } from "../../components/game/chunk.js";

const chunkSize = 20;
let activeTerrainGenerator = null;
let activeTreeGenerator = null;
let treeMesh = null;
class GenerateChunks extends System {
  constructor() {
    super([Camera, Transform]);
  }

  static setTerrainGenerator(t) {
    activeTerrainGenerator = t;
  }

  static setTreeGenerator(t) {
    activeTreeGenerator = t;
    treeMesh = t.generate_mesh();
  }

  apply({ camera, transform }) {
    const frustumAABB = new AABB(camera.getFrustumCorners(gl));

    const maxX = Math.ceil(frustumAABB.max[0] / chunkSize);
    const maxY = Math.ceil(frustumAABB.max[2] / chunkSize);
    const minX = Math.floor(frustumAABB.min[0] / chunkSize);
    const minY = Math.floor(frustumAABB.min[2] / chunkSize);
    const chunks = Array.from(getEntitiesWith(...[Mesh, Chunk]));

    const maxViewX = Math.ceil(
      (camera.far + frustumAABB.min.x) / chunkSize + 3
    );
    const maxViewY = Math.ceil(
      (camera.far + frustumAABB.max.z) / chunkSize + 3
    );
    const minViewX = Math.floor(
      (-camera.far + frustumAABB.min.x) / chunkSize - 3
    );
    const minViewY = Math.floor(
      (-camera.far + frustumAABB.min.z) / chunkSize - 3
    );

    for (let i = chunks.length - 1; i >= 0; i--) {
      const chunk = chunks[i].components.chunk;
      if (
        chunk.x > maxViewX ||
        chunk.x < minViewX ||
        chunk.y > maxViewY ||
        chunk.y < minViewY
      ) {
        chunks[i].deleteEntity();
        chunks.splice(i, 1);
      }
    }
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const exists = chunks.some((v) => {
          const chunk = v.components.chunk;
          return chunk.x === x && chunk.y === y;
        });
        if (!exists) {
          let terrain_mesh = activeTerrainGenerator.generate_mesh(x, y);
          let tree_pos = activeTerrainGenerator.generate_tree_pos(x, y);

          let offset = Vec3.clone([x * 20, 0, y * 20]);
          const trees = [];
          for (let i = 0; i < tree_pos.length / 3; i++) {
            trees.push(
              new Entity(
                new Transform({
                  pos: Vec3.clone([
                    tree_pos[3 * i],
                    tree_pos[3 * i + 1],
                    tree_pos[3 * i + 2],
                  ]).add(offset),
                }),
                new Mesh(treeMesh)
              )
            );
          }

          new Entity(
            new Transform({ pos: Vec3.clone(offset) }),
            new Mesh(terrain_mesh),
            new Chunk(x, y, trees)
          );
        }
      }
    }
  }
}

export { GenerateChunks };
