import { System } from "../../ecs/system.js";
import { Mesh } from "../../components/render/mesh.js";

export class CollectVisibleMeshInstances extends System {
  constructor() {
    super([Mesh]);
    this.visibleMeshInstances = new Set();
  }

  apply({ mesh }, e) {
    if (mesh.visible) {
      this.visibleMeshInstances.add(mesh.instancedMesh);
    }
  }
}
