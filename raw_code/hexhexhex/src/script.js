import {
  DataManager,
  DefaultCompressor,
  DefaultPreprocessor,
} from "./util/compression.js";
import { WindowManager } from "./util/window.js";
import { mat4, vec3 } from "gl-matrix";

const dataManager = new DataManager(
  new DefaultCompressor(),
  new DefaultPreprocessor()
);
const windowManager = new WindowManager(16 / 9);
const gl = windowManager.canvas.getContext("webgl2");

const program = gl.createProgram();
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

const vertexShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: vert

precision mediump float;

uniform mat4 uView;
uniform mat4 uProjection;

layout(location = 0) in vec2 aPosition;
layout(location = 1) in mat4 aModel;
layout(location = 5) in vec3 aColor;

out vec3 vColor;

void main() {
    gl_Position = uProjection * uView * aModel * 
    vec4(aPosition.x, 0., aPosition.y,1.);
    vColor = aColor;
}`;

const fragmentShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

in vec3 vColor;

out vec4 fragColor; 

void main() {
  fragColor = vec4(vColor, 1.);
}`;

gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
gl.attachShader(program, vertexShader);

gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.log(gl.getShaderInfoLog(vertexShader));
  console.log(gl.getShaderInfoLog(fragmentShader));
}

gl.useProgram(program);

const sqrt32 = Math.sqrt(3) / 2;

const hexVerts = [
  0.5,
  sqrt32,
  1,
  0,
  0.5,
  -sqrt32,

  0.5,
  sqrt32,
  0.5,
  -sqrt32,
  -0.5,
  -sqrt32,

  0.5,
  sqrt32,
  -0.5,
  -sqrt32,
  0.5,
  -sqrt32,

  0.5,
  sqrt32,
  -0.5,
  -sqrt32,
  -1,
  0,

  0.5,
  sqrt32,
  -1,
  0,
  -0.5,
  sqrt32,
];

const modelData = new Float32Array(hexVerts);

const transformArray = [];

const xDim = 10;
const yDim = 10;
for (let x = 0; x < xDim; x++) {
  for (let y = 0; y < yDim; y++) {
    const model = mat4.create();
    const xOffset = 1.5 * (x - (xDim - 1) / 2);
    const yOffset = 2 * sqrt32 * (y - (yDim - 1) / 2 + (x % 2 === 0 ? 0.5 : 0));
    mat4.translate(model, model, [xOffset, 0, yOffset]);
    for (let j = 0; j < model.length; j++) {
      transformArray.push(model[j]);
    }

    transformArray.push(Math.random(), Math.random(), Math.random());
  }
}

const transformData = new Float32Array(transformArray);

//

const vao1 = gl.createVertexArray();
gl.bindVertexArray(vao1);
const modelBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer);
gl.bufferData(gl.ARRAY_BUFFER, modelData, gl.STATIC_DRAW);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(0);

const transformBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
gl.bufferData(gl.ARRAY_BUFFER, transformData, gl.STATIC_DRAW);
gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 19 * 4, 0 * 4);
gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 19 * 4, 4 * 4);
gl.vertexAttribPointer(3, 4, gl.FLOAT, false, 19 * 4, 8 * 4);
gl.vertexAttribPointer(4, 4, gl.FLOAT, false, 19 * 4, 12 * 4);
gl.vertexAttribPointer(5, 3, gl.FLOAT, false, 19 * 4, 16 * 4);

gl.vertexAttribDivisor(1, 1);
gl.vertexAttribDivisor(2, 1);
gl.vertexAttribDivisor(3, 1);
gl.vertexAttribDivisor(4, 1);
gl.vertexAttribDivisor(5, 1);

gl.enableVertexAttribArray(1);
gl.enableVertexAttribArray(2);
gl.enableVertexAttribArray(3);
gl.enableVertexAttribArray(4);
gl.enableVertexAttribArray(5);

gl.bindVertexArray(null);

const viewLoc = gl.getUniformLocation(program, "uView");
const projectionLoc = gl.getUniformLocation(program, "uProjection");

const view = mat4.create();
const projection = mat4.create();

mat4.perspective(
  projection,
  Math.PI / 2,
  gl.canvas.width / gl.canvas.height,
  0.01,
  20
);

const cameraPos = vec3.create();
cameraPos[0] = -4;
cameraPos[1] = 10;
const origin = vec3.create();

const draw = () => {
  requestAnimationFrame(draw);

  //vec3.rotateY(cameraPos, cameraPos, origin, 0.002);
  mat4.lookAt(view, cameraPos, origin, [0, 1, 0]);
  gl.uniformMatrix4fv(viewLoc, false, view);
  gl.uniformMatrix4fv(projectionLoc, false, projection);
  gl.bindVertexArray(vao1);
  gl.drawArraysInstanced(gl.TRIANGLES, 0, 15, xDim * yDim);
  gl.bindVertexArray(null);
};

draw();

// webgl types

// Standard Objects

// buffer
// texture
// renderbuffer
// sampler??
// query??

// Containers

// VertexArray
// Framebuffer
// TransformFeedback

// need to add:

// 1. Camera support - can mimic this on the software side
// 2. Hex Mesh -
// 3. Hex placement
// 4. Hex shader
// 5. More complicated hex mesh
// 6. Layout trees and stuff
