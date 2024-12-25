import { vec3 } from "gl-matrix";

vec3.abs = function (out, a) {
  out[0] = Math.abs(a[0]);
  out[1] = Math.abs(a[1]);
  out[2] = Math.abs(a[2]);
};

Array.prototype.peek = function () {
  return this.length ? this[this.length - 1] : null;
};

Array.prototype.equals = function (other) {
  if (!Array.isArray(other)) {
    return false;
  }

  if (other.length !== this.length) {
    return false;
  }

  for (var i = 0; i < this.length; i++) {
    if (this[i] !== other[i]) {
      return false;
    }
  }
  return true;
};
