const instancedMeshes = [];

class InstancedMesh {
  constructor(gl, modelArray, program, maxCount) {
    this.program = program;
    instancedMeshes.push(this);
    const vao = gl.createVertexArray();
    this.gl = gl;
    gl.bindVertexArray(vao);
    const modelBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(modelArray),
      gl.STATIC_DRAW
    );
    this.meshes = [];
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 36, 0);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 36, 12);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 36, 24);
    const transformArray = [];
    const totalSize = 20;
    for (let i = 0; i < maxCount * 20; i++) {
      transformArray.push(0);
    }
    const transformBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(transformArray),
      gl.STATIC_DRAW
    );

    gl.vertexAttribPointer(3, 4, gl.FLOAT, false, totalSize * 4, 0 * 4);
    gl.vertexAttribPointer(4, 4, gl.FLOAT, false, totalSize * 4, 4 * 4);
    gl.vertexAttribPointer(5, 4, gl.FLOAT, false, totalSize * 4, 8 * 4);
    gl.vertexAttribPointer(6, 4, gl.FLOAT, false, totalSize * 4, 12 * 4);
    gl.vertexAttribIPointer(7, 4, gl.INT, totalSize * 4, 16 * 4);

    gl.vertexAttribDivisor(3, 1);
    gl.vertexAttribDivisor(4, 1);
    gl.vertexAttribDivisor(5, 1);
    gl.vertexAttribDivisor(6, 1);
    gl.vertexAttribDivisor(7, 1);

    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    gl.enableVertexAttribArray(2);
    gl.enableVertexAttribArray(3);
    gl.enableVertexAttribArray(4);
    gl.enableVertexAttribArray(5);
    gl.enableVertexAttribArray(6);
    gl.enableVertexAttribArray(7);

    gl.bindVertexArray(null);

    var minX = 100000000;
    var minY = 100000000;
    var minZ = 100000000;
    var maxX = -100000000;
    var maxY = -100000000;
    var maxZ = -100000000;
    for (let i = 0; i < modelArray.length / 3; i++) {
      const x = modelArray[3 * i];
      const y = modelArray[3 * i + 1];
      const z = modelArray[3 * i + 2];

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      minZ = Math.min(minZ, z);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      maxZ = Math.max(maxZ, z);
    }

    this.boundingBox = [
      [minX, minY, minZ],
      [maxX, maxY, maxZ],
    ];
    this.modelArray = modelArray;
    this.modelBuffer = modelBuffer;
    this.transformArray = new Float32Array(transformArray);
    this.transformBuffer = transformBuffer;
    this.vao = vao;
    this.maxCount = maxCount;
  }

  addMesh(gl, mesh) {
    this.meshes.push(mesh);
    this.updateIndex(gl, this.meshes.length - 1);
    return this.meshes.length - 1;
  }

  removeMesh(gl, index) {
    if (index < this.meshes.length - 1) {
      this.meshes[index] = this.meshes[this.meshes.length - 1];
      this.meshes[index].updateIndex(index);

      const offset = 20 * (this.meshes.length - 1);
      const transformMat = this.transformArray.slice(offset, offset + 16);
      this.updateTransform(index, transformMat);
      this.updateIndex(gl, index);
    }
    this.meshes.pop();
  }

  updateTransform(index, newMatrix) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.transformBuffer);

    const offset = 4 * 20 * index;
    this.transformArray.set(newMatrix, offset / 4);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, offset, newMatrix);
  }

  updateIndex(gl, index) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.transformBuffer);

    const offset = 20 * index + 16;
    this.transformArray.set([index, 0, 0, 0], offset);
    gl.bufferSubData(
      gl.ARRAY_BUFFER,
      4 * offset,
      new Int32Array([index, 0, 0, 0])
    );
  }

  render(gl) {
    gl.bindVertexArray(this.vao);
    gl.drawArraysInstanced(
      gl.TRIANGLES,
      0,
      this.modelArray.length / 6,
      this.meshes.length
    );
    gl.bindVertexArray(null);
  }
}

export { InstancedMesh, instancedMeshes };
