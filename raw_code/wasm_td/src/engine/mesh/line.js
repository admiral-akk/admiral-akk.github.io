import { Vec3 } from "gl-matrix";

const delta = new Vec3();
export class Line {
  constructor(start, dir) {
    this.start = start;
    this.dir = dir.normalize();
  }

  static point(line, t) {
    const p = new Vec3(line.start);
    p.scaleAndAdd(line.dir, t);
    return p;
  }

  static closestPoint(line, point) {
    // if the point is right on the start, the algorithm will blow up
    // sample a different start point
    if (Vec3.squaredDistance(point, line.start) < 0.001) {
      line.start.add(line.dir);
    }
    Vec3.sub(delta, line.start, point);
    Vec3.scaleAndAdd(delta, line.start, line.dir, -Vec3.dot(delta, line.dir));
    return Vec3.clone(delta);
  }

  static distanceToPoint(line, point) {
    return Vec3.distance(Line.closestPoint(line, point), point);
  }
}
