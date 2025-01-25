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

  closestPointOnLine(point) {
    // if the point is right on the start, the algorithm will blow up
    // sample a different start point
    const start = new Vec3(point.start);
    if (Vec3.squaredDistance(point, start) < 0.001) {
      start.add(line.dir);
    }
    Vec3.sub(delta, start, point);
    Vec3.scaleAndAdd(delta, start, this.dir, -Vec3.dot(delta, this.dir));
    return Vec3.clone(delta);
  }

  lineToPlaneT(plane) {
    const { start, dir } = this;
    if (Math.abs(Vec3.dot(plane.normal, dir)) < 0.01) {
      return null;
    }
    return (
      (plane.offset - Vec3.dot(plane.normal, start)) /
      Vec3.dot(plane.normal, dir)
    );
  }

  lineToPlane(plane) {
    const { start, dir } = this;
    const t = this.lineToPlaneT(plane);
    if (t === null) {
      return t;
    }

    return Vec3.clone(start).add(Vec3.clone(dir).scale(t));
  }

  planeIntersect(plane) {}
}
