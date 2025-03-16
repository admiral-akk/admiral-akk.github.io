import { Quat } from "gl-matrix";
import { Transform } from "../components/render/transform";
import { Entity } from "../engine/ecs/entity";
import { Camera } from "../components/render/camera";

export class RiggedCamera extends Entity {
  constructor() {
    const cameraBaseT = new Transform({ pos: [0, 0, 0] });

    const horizontalRotT = new Transform({
      parent: cameraBaseT,
      rot: Quat.create().rotateY(-Math.PI / 4),
    });

    const verticalRotT = new Transform({
      parent: horizontalRotT,
      rot: Quat.create().rotateX(Math.PI / 4),
    });

    const zoomT = new Transform({
      parent: verticalRotT,
      pos: [0, 0, -10],
    });

    new Entity(cameraBaseT);
    new Entity(horizontalRotT);
    new Entity(verticalRotT);
    new Entity(zoomT);

    super(
      new Camera({
        base: cameraBaseT,
        horizontalRotation: horizontalRotT,
        verticalRotation: verticalRotT,
        pan: zoomT,
      }),
      new Transform({
        parent: zoomT,
      })
    );
  }
}
