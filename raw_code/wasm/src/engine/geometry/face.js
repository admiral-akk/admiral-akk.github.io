import { Primative } from "./primative";

export class Face extends Primative {
  constructor(edges, metadata = {}) {
    super(metadata);
    this.edges = edges;
  }

  equals(other, epsilon = 0.001) {
    this.matching(other);
    if (this.edges.length !== other.edges.length) {
      return false;
    }

    const edgeCount = this.edges.length;

    for (let i = 0; i < edgeCount; i++) {
      // find an edge that matches.
      if (this.edges[i].equals(other.edges[0], epsilon)) {
        // all of the edges should equal in order
        for (let j = 1; j < edgeCount; j++) {
          if (
            !this.edges[(i + j) % edgeCount].equals(other.edges[j], epsilon)
          ) {
            return false;
          }
        }
        return true;
      }
    }
    // if we can't find a matching edge, then they differ.
    return false;
  }
}
