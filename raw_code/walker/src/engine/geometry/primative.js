export class Primative {
  constructor(metadata = {}) {
    this.metadata = metadata;
  }

  distance(other) {
    throw new Error("Unimplemented!");
  }
}
