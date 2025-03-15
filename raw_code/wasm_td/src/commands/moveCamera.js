import { Quat, Vec3 } from "gl-matrix";
import { Camera } from "../components/render/camera";
import { Command } from "../engine/command";
import { getEntitiesWith } from "../engine/ecs/entity";

export class MoveCamera extends Command {
  constructor(move) {
    super();
    this.move = move;
  }

  apply() {
    getEntitiesWith(Camera).forEach((e) => {
      const { horizontalRotation, base } = e.components.camera.transforms;

      const invRot = Quat.clone(horizontalRotation.rot).invert();

      Vec3.transformQuat(this.move, this.move, invRot);
      Vec3.add(base.pos, base.pos, this.move);
    });
  }
}
