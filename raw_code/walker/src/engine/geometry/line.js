import { Vec3 } from "gl-matrix";
import { Primative } from "./primative";

export class Line extends Primative {
  constructor(start, dir, metadata = {}) {
    super(metadata);
    this.start = start;
    this.dir = Vec3.clone(dir).normalize();
  }

  point(t) {
    return new Vec3(this.start).scaleAndAdd(this.dir, t);
  }
}
