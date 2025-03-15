import { Mesh } from "../../components/render/mesh";
import { Transform } from "../../components/render/transform";
import { System } from "../../engine/ecs/system";
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
