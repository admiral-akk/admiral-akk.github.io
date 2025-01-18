import { Quat, quat } from "gl-matrix";
import { Mesh } from "../../components/render/mesh";
import { Transform } from "../../components/render/transform";
import { System } from "../../ecs/system";

Quat.prototype.clone = function () {
  return quat.clone(this);
};

export class RotateMeshes extends System {
  constructor() {
    super([Mesh, Transform]);
  }

  apply({ mesh, transform }) {
    transform.setRotation(transform.rot.clone().rotateZ(0.01));
  }
}
