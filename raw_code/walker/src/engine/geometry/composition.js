import { Vec3 } from "gl-matrix";
import { PlanarEdge } from "./planarEdge";
import { Face } from "./face";
import { Primative } from "./primative";

export class Composition extends Primative {
  constructor(brush, metadata = {}) {
    super(metadata);
    this.brushes = [brush];
  }

  faces() {
    const faces = [];
    this.brushes.forEach((brush) => {
      const { planes } = brush;
      for (let i = 0; i < planes.length; i++) {
        const intersectingPlanes = [];
        const plane1 = planes[i];
        // for each plane in a brush, find all of its intersections
        for (let j = 0; j < planes.length; j++) {
          const plane2 = planes[j];

          const edge = PlanarEdge.makePlanarEdge({ plane1, plane2, planes });
          if (edge !== null) {
            intersectingPlanes.push(plane2);
          }
        }

        const outwardVector = (edge) => {
          return Vec3.clone(edge.plane2.normal)
            .scaleAndAdd(
              plane1.normal,
              -Vec3.dot(plane1.normal, edge.plane2.normal)
            )
            .normalize();
        };
        // for each plane in a brush, find all of its intersections
        const edges = [];
        for (let j = 0; j < intersectingPlanes.length; j++) {
          const plane2 = intersectingPlanes[j];

          const edge = PlanarEdge.makePlanarEdge({
            plane1,
            plane2,
            planes: intersectingPlanes,
          });
          if (edge !== null) {
            edges.push([edge, outwardVector(edge)]);
          }
        }

        const forward = edges[0][1];

        // sort relative to forward
        const edgeVal = ([_, dir]) => {
          const temp2 = new Vec3();
          Vec3.cross(temp2, dir, forward);
          const cross = Vec3.dot(plane1.normal, temp2);
          const dot = Vec3.dot(dir, forward);
          var ret;
          if (dot < 0) {
            if (cross < 0) {
              ret = -2 - cross;
            } else {
              ret = 2 - cross;
            }
          } else {
            ret = cross;
          }
          return ret;
        };

        edges.sort((a, b) => {
          return edgeVal(a) - edgeVal(b);
        });

        const sortedEdges = Array.from(
          edges.map((edge) => {
            return edge[0];
          })
        );

        faces.push(new Face(sortedEdges));
      }
    });
    return faces;
  }
}
