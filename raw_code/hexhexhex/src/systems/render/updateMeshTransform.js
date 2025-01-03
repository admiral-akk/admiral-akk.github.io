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
      } else {
        mesh.instancedMesh.removeMesh(mesh);
      }
      mesh.updated = false;
    }

    if (mesh.visible) {
      // update transform
      mesh.instancedMesh.updateTransform(mesh, transform.getWorldMatrix());
    }
    if (mesh.visible) {
      // update color
      mesh.instancedMesh.updateColor(mesh, mesh.color);
    }
  }
}

export { UpdateMeshTransform };
