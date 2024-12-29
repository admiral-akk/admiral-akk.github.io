import { System } from "../../ecs/system.js";
import { Selected } from "../../components/client/selected.js";
import { Unit } from "../../components/game/unit.js";
import { Transform } from "../../components/render/transform.js";

class MarkSelected extends System {
  constructor(markerEntity) {
    super([Unit, Selected, Transform]);
    this.markerEntity = markerEntity;
  }

  apply({ transform }) {
    this.markerEntity.components.transform.setParent(transform);
  }
}

export { MarkSelected };
