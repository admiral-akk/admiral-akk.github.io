const addVert = (vertex, metadata, modelArray) => {
  modelArray.push(vertex[0], vertex[1], vertex[2]);
  if (metadata?.normal) {
    const { normal } = metadata;
    modelArray.push(normal[0], normal[1], normal[2]);
  } else {
    // default to 0
    modelArray.push(0, 0, 0);
  }
  if (metadata?.color) {
    const { color } = metadata;
    modelArray.push(color[0], color[1], color[2]);
  } else {
    // default to 0
    modelArray.push(0, 0, 0);
  }
};

export class Triangle {
  constructor(p1, p2, p3, pointMetadata = new Map(), metadata = {}) {
    this.points = [p1, p2, p3];
    this.pointMetadata = pointMetadata;
    this.metadata = metadata;
  }

  // this is fundementally about how our shader expects meshes to be formatted
  // todo: move into rendering
  static pushVertices(triangle, modelArray) {
    const { points, pointMetadata } = triangle;
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      addVert(point, pointMetadata.get(point), modelArray);
    }
  }
}
