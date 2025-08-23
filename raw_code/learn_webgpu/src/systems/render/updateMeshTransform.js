import { Mesh } from "../../components/render/mesh";
import { Transform } from "../../components/render/transform";
import { System } from "../../ecs/system";

class UpdateMeshTransform extends System {
  constructor() {
    super([Mesh, Transform]);
  }

  apply({ mesh, transform }) {
    if (mesh.updated) {
      // update visibility
      if (mesh.visible) {
        mesh.instancedMesh.addMesh(mesh);
        mesh.instancedMesh.updateMetadata(mesh, mesh.metadata);
        mesh.instancedMesh.updateTransform(mesh, transform.getWorldMatrix());
      } else {
        mesh.instancedMesh.removeMesh(mesh);
      }
      mesh.updated = false;
    }
  }
}

export { UpdateMeshTransform };
