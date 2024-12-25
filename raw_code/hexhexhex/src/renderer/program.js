function createProgram(gl, vertShader, fragShader) {
  const program = gl.createProgram();
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertShader);
  gl.compileShader(vertexShader);
  gl.attachShader(program, vertexShader);

  gl.shaderSource(fragmentShader, fragShader);
  gl.compileShader(fragmentShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
    console.log(gl.getShaderInfoLog(fragmentShader));
  }
  return program;
}

const quadData = new Float32Array([
  // Pos (xy)         // UV coordinate
  -1, 1, 0, 1, -1, -1, 0, 0, 1, 1, 1, 1, 1, -1, 1, 0,
]);

// Step 5: Add the quad program and configure its buffers
const quadVertexShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: vert

layout(location=0) in vec4 aPosition;
layout(location=1) in vec2 aTexCoord;

out vec2 vTexCoord;

void main()
{
    gl_Position = aPosition;
    vTexCoord = aTexCoord;
}`;

var postProcessVAO = null;

function getPostProcessVao(gl) {
  if (postProcessVAO != null) {
    return postProcessVAO;
  }

  postProcessVAO = gl.createVertexArray();
  gl.bindVertexArray(postProcessVAO);

  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, quadData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);

  gl.bindVertexArray(null);
  return postProcessVAO;
}

function createPostProcessProgram(gl, fragmentShader) {
  return createProgram(gl, quadVertexShaderSource, fragmentShader);
}

export { createProgram, getPostProcessVao, createPostProcessProgram };
