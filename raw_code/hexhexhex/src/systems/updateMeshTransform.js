import { System } from "../ecs/system";

class UpdateMeshTransform extends System {
  constructor() {
    super([]);
  }

  apply(components) {
    const mesh = components[0];
    const transform = components[1];
    if (transform.updated) {
      transform.updated = false;
      mesh.instancedMesh.updateTransform(mesh.index, transform.getMatrix());
    }
  }
}

export { UpdateMeshTransform };
