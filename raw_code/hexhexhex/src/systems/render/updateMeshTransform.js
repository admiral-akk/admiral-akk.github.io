import { Mesh } from "../../components/render/mesh";
import { Transform } from "../../components/render/transform";
import { System } from "../../ecs/system";

class UpdateMeshTransform extends System {
  constructor() {
    super([Mesh, Transform]);
  }

  apply({ mesh, transform }) {
    mesh.instancedMesh.updateTransform(mesh.index, transform.getWorldMatrix());
  }
}

export { UpdateMeshTransform };
