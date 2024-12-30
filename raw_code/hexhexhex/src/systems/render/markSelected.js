import { System } from "../../ecs/system.js";
import { Selected } from "../../components/client/selected.js";
import { Transform } from "../../components/render/transform.js";
import { Hex } from "../../components/game/hex.js";

class MarkSelected extends System {
  constructor(markerEntity) {
    super([Hex, Selected, Transform]);
    this.markerEntity = markerEntity;
  }

  apply({ transform }) {
    this.markerEntity.components.transform.setParent(transform);
  }
}

export { MarkSelected };
