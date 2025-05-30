import { Mesh } from "../../components/render/mesh";
import { Transform } from "../../components/render/transform";
import { System } from "../../ecs/system";
import { AABB } from "../../engine/aabb";
import { gl } from "../../engine/renderer";

let activeCamera = null;

class FrustumCulling extends System {
  constructor() {
    super([Mesh, Transform]);
  }

  static setActiveCamera(camera) {
    activeCamera = camera;
  }

  apply({ mesh, transform }) {
    const frustumAABB = new AABB(activeCamera.getFrustumCorners(gl));

    // go through each mesh, calculate it's AABB and see if it intersects with
    // the camera frustum
    const meshAABB = mesh.getAABB(transform);
    // console.log(frustumAABB[0], frustumAABB[1]);

    const intersection = meshAABB.intersects(frustumAABB);
    // // check intersection
    if (mesh.visible !== intersection) {
      mesh.setVisible(intersection);
      if (mesh.visible) {
        mesh.instancedMesh.addMesh(mesh);
        mesh.instancedMesh.updateMetadata(mesh, mesh.metadata);
        mesh.instancedMesh.updateTransform(mesh, transform.getWorldMatrix());
      } else {
        mesh.instancedMesh.removeMesh(mesh);
      }
    }
  }
}

export { FrustumCulling };
