import { System } from "../../ecs/system.js";
import { Selected } from "../../components/client/selected.js";
import { Transform } from "../../components/render/transform.js";

class MarkSelected extends System {
  constructor(markerEntity) {
    super([Selected, Transform]);
    this.markerEntity = markerEntity;
  }

  apply({ transform }, entity) {
    this.markerEntity.components.transform.setParent(transform);
    if (entity.components.hex) {
      this.markerEntity.components.transform.setPosition([0, 0.4, 0]);
      this.markerEntity.components.transform.setScale([1, 1, 1]);
    }
    if (entity.components.resource) {
      this.markerEntity.components.transform.setPosition([0, 0, 0]);
      this.markerEntity.components.transform.setScale([0.2, 0.2, 0.2]);
    }
    if (entity.components.option) {
      this.markerEntity.components.transform.setPosition([0, 0, 0]);
      this.markerEntity.components.transform.setScale([0.3, 0.3, 0.3]);
    }
  }
}

export { MarkSelected };
