import { Vec3 } from "gl-matrix";
import { Brush } from "./brush";
import { Plane } from "./plane";

// A mesh is composed of brushes.
export class BrushMesh {
  constructor(...brushes) {
    this.brushes = brushes;
  }

  subtract(other) {
    const newBrushes = [];
    this.brushes.forEach((brush) => {
      const [planeToPoints, pointsToPlanes] = brush.planePoints();

      const vertices = Array.from(pointsToPlanes.keys());

      other.brushes.forEach((otherBrush) => {
        // for each plane in otherBrush
        // add its inverse to brush, then check if anything remains
        // if so, add that to brushes
        otherBrush.planes.forEach((plane) => {
          const inverted = Plane.invert(plane);
          // check if this plane would remove everything
          if (vertices.some((v) => Plane.distanceToPoint(inverted, v) > 0)) {
            // if something would remain, add a new brush.
            const c = brush.clone();
            c.planes.push(inverted);
            newBrushes.push(c);
          }
        });
      });
    });
    this.brushes = newBrushes;
  }

  vertices(epsilon = 0.0001) {
    const vertices = [];
    this.triangles().forEach((triangle) => {
      const [p1, p2, p3] = triangle.points;
      vertices.find((v) => Vec3.distance(v, p1) <= epsilon) === undefined
        ? vertices.push(p1)
        : null;
      vertices.find((v) => Vec3.distance(v, p2) <= epsilon) === undefined
        ? vertices.push(p2)
        : null;
      vertices.find((v) => Vec3.distance(v, p3) <= epsilon) === undefined
        ? vertices.push(p3)
        : null;
    });
    return vertices;
  }

  triangles() {
    const triangles = [];
    this.brushes.forEach((brush) => triangles.push(...brush.triangles()));
    return triangles;
  }
}
