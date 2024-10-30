class LineSegment extends Array {
  constructor(start, end) {
    super();
    this.push(start, end);
  }

  distanceTo(other) {
    const delta = this[1].clone().sub(this[0]);
    const deltaLength = delta.len();

    const dir = other.clone().sub(this[0]);
    const t = (dir.dot(delta) / delta.lenSq()).clamp(0, 1);

    return this[0].clone().add(delta.mul(t)).sub(other).len();
  }
}

class Vec {
  static X2 = new Vec(1, 0);
  static X3 = new Vec(1, 0, 0);
  static X4 = new Vec(1, 0, 0, 0);

  static Y2 = new Vec(0, 1);
  static Y3 = new Vec(0, 1, 0);
  static Y4 = new Vec(0, 1, 0, 0);

  static Z3 = new Vec(0, 0, 1);
  static Z4 = new Vec(0, 0, 1, 0);

  static W4 = new Vec(0, 0, 0, 1);

  static ONE2 = new Vec(1, 1);
  static ONE3 = new Vec(1, 1, 1);
  static ONE4 = new Vec(1, 1, 1, 1);

  static ZERO2 = new Vec(0, 0);
  static ZERO3 = new Vec(0, 0, 0);
  static ZERO4 = new Vec(0, 0, 0, 0);

  constructor(x, y, z = null, w = null) {
    this.x = x;
    this.y = y;
    if (z !== null) {
      this.z = z;
      if (w !== null) {
        this.w = w;
        this.length = 4;
      } else {
        this.length = 3;
      }
    } else {
      this.length = 2;
    }
  }

  copy(other) {
    this.x = other.x;
    this.y = other.y;
    if (this.length > 3) {
      this.w = other.w ?? 0;
    }
    if (this.length > 2) {
      this.z = other.z ?? 0;
    }
    return this;
  }

  add(other) {
    const isNum = typeof other === "number";
    this.x += isNum ? other : other.x;
    this.y += isNum ? other : other.y;
    if (this.length > 2) {
      this.z += isNum ? other : other.z ?? 0;
    }
    if (this.length > 3) {
      this.w += isNum ? other : other.w ?? 0;
    }
    return this;
  }

  sub(other) {
    const isNum = typeof other === "number";
    this.x -= isNum ? other : other.x;
    this.y -= isNum ? other : other.y;
    if (this.length > 2) {
      this.z -= isNum ? other : other.z ?? 0;
    }
    if (this.length > 3) {
      this.w -= isNum ? other : other.w ?? 0;
    }
    return this;
  }

  mul(other) {
    const isNum = typeof other === "number";
    this.x *= isNum ? other : other.x;
    this.y *= isNum ? other : other.y;
    if (this.length > 2) {
      this.z *= isNum ? other : other.z ?? 0;
    }
    if (this.length > 3) {
      this.w *= isNum ? other : other.w ?? 0;
    }
    return this;
  }

  dot(other) {
    let sum = 0;
    sum += this.x * other.x;
    sum += this.y * other.y;
    sum += (this.z ?? 0) * (other.z ?? 0);
    sum += (this.w ?? 0) * (other.w ?? 0);
    return sum;
  }

  min(other) {
    const isNum = typeof other === "number";
    this.x = Math.min(this.x, isNum ? other : other.x);
    this.y = Math.min(this.y, isNum ? other : other.y);
    if (this.length > 2) {
      this.z = Math.min(this.z, isNum ? other : other.z ?? 0);
    }
    if (this.length > 3) {
      this.w = Math.min(this.w, isNum ? other : other.w ?? 0);
    }
    return this;
  }

  clamp(low, high) {
    this.x = this.x.clamp(low, high);
    this.y = this.y.clamp(low, high);
    if (this.length > 2) {
      this.z = this.z.clamp(low, high);
    }
    if (this.length > 3) {
      this.w = this.w.clamp(low, high);
    }
    return this;
  }
  max(other) {
    const isNum = typeof other === "number";
    this.x = Math.max(this.x, isNum ? other : other.x);
    this.y = Math.max(this.y, isNum ? other : other.y);
    if (this.length > 2) {
      this.z = Math.max(this.z, isNum ? other : other.z ?? 0);
    }
    if (this.length > 3) {
      this.w = Math.max(this.w, isNum ? other : other.w ?? 0);
    }
    return this;
  }
  normalize() {
    const sum = this.dot(this);
    this.x /= sum;

    this.y /= sum;
    if (this.length > 2) {
      this.z = Math.max(this.z, other.z ?? 0);
    }
    if (this.length > 3) {
      this.w = Math.max(this.w, other.w ?? 0);
    }
    return this;
  }

  cross(other) {
    if (other.length === this.length) {
      if (this.length === 2) {
        return this.x * other.y - this.y * other.x;
      } else if (this.length === 3) {
        return new Vec([
          this.y * other.z - this.z * other.y,
          this.z * other.x - this.x * other.z,
          this.x * other.y - this.y * other.x,
        ]);
      } else {
        throw new Error("Can't do 4D cross (yet?)");
      }
    } else {
      throw new Error("Dimensions need to match for cross.");
    }
  }

  len() {
    return Math.sqrt(this.lenSq());
  }

  lenSq() {
    return this.dot(this);
  }

  clone() {
    return new Vec(
      this.x,
      this.y,
      this.z !== undefined ? this.z : null,
      this.w !== undefined ? this.w : null
    );
  }
}

export { Vec, LineSegment };
