import { Mesh } from "../components/mesh";
import { Transform } from "../components/transform";
import { System } from "../ecs/system";

class UpdateMeshTransform extends System {
  constructor() {
    super([Mesh, Transform]);
  }

  apply({ mesh, transform }) {
    if (transform.updated) {
      transform.updated = false;
      mesh.instancedMesh.updateTransform(mesh.index, transform.getMatrix());
    }
  }
}

export { UpdateMeshTransform };
