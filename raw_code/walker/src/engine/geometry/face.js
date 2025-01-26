import { Primative } from "./Primative";

export class Face extends Primative {
  constructor(edges, metadata = {}) {
    super(metadata);
    this.edges = edges;
  }
}
