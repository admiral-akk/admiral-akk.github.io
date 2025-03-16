import { Quat, Vec3 } from "gl-matrix";
import { Camera } from "../components/render/camera";
import { Command } from "../engine/command";
import { getEntitiesWith } from "../engine/ecs/entity";

export class MoveCamera extends Command {
  constructor({ move, rotateAngle, zoom, mouseDelta }) {
    super();
    this.move = move;
    this.rotateAngle = rotateAngle;
    this.zoom = zoom;
    this.mouseDelta = mouseDelta;
  }

  apply() {
    getEntitiesWith(Camera).forEach((e) => {
      const { horizontalRotation, verticalRotation, base, pan } =
        e.components.camera.transforms;

      const invRot = Quat.clone(horizontalRotation.rot).invert();

      Vec3.transformQuat(this.move, this.move, invRot);
      Vec3.add(base.pos, base.pos, this.move);
      horizontalRotation.rot.rotateY(this.rotateAngle);
      horizontalRotation.setRotation(horizontalRotation.rot);

      pan.pos[2] -= 0.05 * this.zoom;
      pan.pos[2] = Math.clamp(pan.pos[2], -25, -4);
      pan.setPosition(pan.pos);

      horizontalRotation.rot.rotateY((5 * this.mouseDelta.x) / Math.PI);
      verticalRotation.rot.rotateX(5 * this.mouseDelta.y);
      horizontalRotation.setRotation(horizontalRotation.rot);
      verticalRotation.setRotation(verticalRotation.rot);
    });
  }
}
