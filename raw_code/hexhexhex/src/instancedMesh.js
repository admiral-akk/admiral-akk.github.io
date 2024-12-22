import { mat4 } from "gl-matrix";

class InstancedMesh {
  constructor(gl, modelArray, maxCount) {
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const modelBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(modelArray),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    const transformArray = [];
    for (let i = 0; i < maxCount; i++) {
      const model = mat4.create();
      for (let j = 0; j < model.length; j++) {
        transformArray.push(model[j]);
      }
      transformArray.push(0, 0, 0, 0);
    }
    const transformBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(transformArray),
      gl.STATIC_DRAW
    );

    const totalSize = 20;
    gl.vertexAttribPointer(2, 4, gl.FLOAT, false, totalSize * 4, 0 * 4);
    gl.vertexAttribPointer(3, 4, gl.FLOAT, false, totalSize * 4, 4 * 4);
    gl.vertexAttribPointer(4, 4, gl.FLOAT, false, totalSize * 4, 8 * 4);
    gl.vertexAttribPointer(5, 4, gl.FLOAT, false, totalSize * 4, 12 * 4);
    gl.vertexAttribPointer(6, 4, gl.FLOAT, false, totalSize * 4, 16 * 4);

    gl.vertexAttribDivisor(2, 1);
    gl.vertexAttribDivisor(3, 1);
    gl.vertexAttribDivisor(4, 1);
    gl.vertexAttribDivisor(5, 1);
    gl.vertexAttribDivisor(6, 1);

    gl.enableVertexAttribArray(2);
    gl.enableVertexAttribArray(3);
    gl.enableVertexAttribArray(4);
    gl.enableVertexAttribArray(5);
    gl.enableVertexAttribArray(6);

    gl.bindVertexArray(null);
    this.modelArray = modelArray;
    this.modelBuffer = modelBuffer;
    this.transformArray = transformArray;
    this.transformBuffer = transformBuffer;
    this.vao = vao;
    this.maxCount = maxCount;
  }

  updateTransform(gl, index, newMatrix) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.transformBuffer);

    gl.bufferSubData(gl.ARRAY_BUFFER, 4 * 20 * index, newMatrix);
  }

  updateCoordinates(gl, index, coordinates) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.transformBuffer);
    gl.bufferSubData(
      gl.ARRAY_BUFFER,
      4 * 20 * index + 4 * 16,
      new Float32Array([coordinates[0], coordinates[1], 0, 0])
    );
  }

  render(gl, count = this.maxCount) {
    gl.bindVertexArray(this.vao);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, this.modelArray.length / 6, count);
    gl.bindVertexArray(null);
  }
}

export { InstancedMesh };
