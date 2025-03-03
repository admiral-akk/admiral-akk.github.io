import { Quat, Vec3 } from "gl-matrix";
import { Plane } from "./plane";

// A mesh is composed of brushes.
export class BrushMesh {
  constructor(...brushes) {
    this.brushes = brushes;
    this.translation = new Vec3();
    this.scale = new Vec3(1, 1, 1);
    this.rotation = Quat.identity(new Quat());
  }

  clone() {
    return new BrushMesh(...Array.from(this.brushes));
  }

  add(other) {
    this.subtract(other);
    this.brushes.push(...other.brushes);
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
          if (true) {
            // apply the other mesh's transforms, to bring it to world space
            inverted.applyTransform(
              other.scale,
              other.rotation,
              other.translation
            );

            // invert this mesh's transforms, to bring it into model space.
            inverted.applyInverseTransform(
              this.scale,
              this.rotation,
              this.translation
            );
          }
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
    this.brushes.forEach((brush) => {
      brush.applyTransform(this.scale, this.rotation, this.translation);
      triangles.push(...brush.triangles());
    });
    return triangles;
  }
}
