import { Vec } from "../utils/vector";

class Mesh {
  static circleVertices = (() => {
    const vertices = [];
    const numPts = 32;
    for (var i = 0; i <= numPts; i++) {
      vertices.push(
        Math.sin((i * Math.PI * 2) / numPts),
        Math.cos((i * Math.PI * 2) / numPts)
      );
    }
    return vertices;
  })();
  static boxVertices = [1, 1, 1, -1, -1, -1, -1, 1];

  constructor(type, scale) {
    this.scale = scale;
    switch (type) {
      case "box":
        this.vertices = Mesh.boxVertices;
        break;
      case "circle":
        this.vertices = Mesh.circleVertices;
        break;
      default:
        throw new Error("Unknown Mesh Type");
    }
  }
}

class Collider {
  constructor(type, scale) {
    this.scale = scale;
    switch (type) {
      case "box":
        this.type = type;
        break;
      case "sphere":
        this.type = type;
        break;
      default:
        throw new Error("Unknown Mesh Type");
    }
  }
}

function distanceTo(point, start, end) {
  const delta = end.clone().sub(start);

  const dir = point.clone().sub(start);
  const t = (dir.dot(delta) / delta.lenSq()).clamp(0, 1);

  return start.clone().add(delta.mul(t)).sub(point).len();
}

class Collision {
  constructor({ normal }) {
    this.normal = normal;
  }
}

class Entity {
  constructor({
    position = new Vec(0, 0),
    velocity = new Vec(0, 0),
    collider = null,
    mesh = null,
  }) {
    this.position = position;
    this.velocity = velocity;
    if (mesh) {
      this.mesh = mesh;
    }
    if (collider) {
      this.collider = collider;
    }
  }

  collides(other) {
    if (!this.collider || !other.collider) {
      return false;
    }

    const scale1 = this.collider.scale;
    const scale2 = other.collider.scale;

    const rawDelta = this.position.clone().sub(other.position);
    const delta = rawDelta.clone().abs();

    switch (this.collider.type) {
      case "sphere":
        switch (other.collider.type) {
          case "sphere":
            delta.mul(scale1).normalize().mul(scale1);

            const start = this.position.clone();
            const end = start
              .clone()
              .add(delta)
              .sub(other.position)
              .div(scale2);
            start.div(scale2);

            return distanceTo(other.position, start, end) <= 1;
          case "box":
            delta.sub(scale2).div(scale1);
            // inside the box
            if (delta.x <= 0 && delta.y <= 0) {
              return new Collision({ normal: rawDelta.normalize().mul(-1) });
            }
            // hits the top/bottom of the box
            if (delta.x <= 0 && delta.y <= 1) {
              if (rawDelta.y > 0) {
                return new Collision({ normal: new Vec(0, 1) });
              } else {
                return new Collision({ normal: new Vec(0, -1) });
              }
            }
            // hits the side of the box
            if (delta.x <= 1 && delta.y <= 0) {
              if (rawDelta.x > 0) {
                return new Collision({ normal: new Vec(1, 0) });
              } else {
                return new Collision({ normal: new Vec(-1, 0) });
              }
            }
            // hits the corner of the box
            if (delta.lenSq() <= 1) {
              console.log("corner");
              return new Collision({ normal: delta.normalize().mul(-1) });
            }
            return null;
          default:
            return new Error("Unknown type.");
        }
      case "box":
        switch (other.collider.type) {
          case "sphere":
            delta.sub(scale1).div(scale2);
            // inside the box
            if (delta.x <= 0 && delta.y <= 0) {
              return new Collision({ normal: rawDelta.normalize().mul(-1) });
            }
            // hits the top/bottom of the box
            if (delta.x <= 0 && delta.y <= 1) {
              if (rawDelta.y > 0) {
                return new Collision({ normal: new Vec(0, 1) });
              } else {
                return new Collision({ normal: new Vec(0, -1) });
              }
            }
            // hits the side of the box
            if (delta.x <= 1 && delta.y <= 0) {
              if (rawDelta.x > 0) {
                return new Collision({ normal: new Vec(1, 0) });
              } else {
                return new Collision({ normal: new Vec(-1, 0) });
              }
            }
            // hits the corner of the box
            if (delta.lenSq() <= 1) {
              console.log("corner");
              return new Collision({ normal: delta.normalize().mul(-1) });
            }
            return null;
          case "box":
            delta.sub(scale1).sub(scale2);
            return delta.x <= 2 && delta.y <= 2;
          default:
            return new Error("Unknown type.");
        }
      default:
        return new Error("Unknown type.");
    }
  }
}

export { Entity, Collider };
