import { System } from "../../ecs/system.js";
import { Mesh } from "../../components/render/mesh.js";

export class CollectVisibleMeshInstances extends System {
  constructor() {
    super([Mesh]);
    this.visibleMeshInstances = new Set();
    this.lineMeshInstances = new Set();
  }

  apply({ mesh }, e) {
    if (mesh.visible) {
      if (e.components.connection) {
        this.lineMeshInstances.add(mesh.instancedMesh);
      } else {
        this.visibleMeshInstances.add(mesh.instancedMesh);
      }
    }
  }
}
