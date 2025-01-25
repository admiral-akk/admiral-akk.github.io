import { Primative } from "./primative";

export class Composition extends Primative {
  constructor(brush, metadata = {}) {
    super(metadata);
    this.brushes = [brush];
  }
}
