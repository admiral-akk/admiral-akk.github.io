export class Primative {
  constructor(metadata = {}) {
    this.metadata = metadata;
  }

  matching(other) {
    if (this.constructor !== other.constructor) {
      throw new Error(
        `Class mismatch, this class: ${this.constructor}, other class: ${other.constructor}`
      );
    }
  }

  distance(other) {
    throw new Error("Unimplemented!");
  }

  equals(other, epsilon = 0.001) {
    throw new Error("Unimplemented!");
  }
}
