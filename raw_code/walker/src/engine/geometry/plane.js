import { Vec3 } from "gl-matrix";
import { Primative } from "./primative";

export class Plane extends Primative {
  constructor(normal, offset, metadata = {}) {
    super(metadata);
    this.normal = Vec3.clone(normal).normalize();
    this.offset = offset;
  }
}
