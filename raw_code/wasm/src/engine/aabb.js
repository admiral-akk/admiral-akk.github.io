import { Vec3 } from "gl-matrix";

export class AABB {
  constructor(points) {
    this.min = Vec3.clone(points[0]);
    this.max = Vec3.clone(points[0]);
    for (let i = 1; i < points.length; i++) {
      this.min.min(points[i]);
      this.max.max(points[i]);
    }
  }

  intersects(other) {
    return this.max.geq(other.min) && other.max.geq(this.min);
  }
}
