import {
  DataManager,
  DefaultCompressor,
  DefaultPreprocessor,
} from "./util/compression.js";
import { WindowManager } from "./util/window.js";

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

layout(location = 0) in float aPointSize;
layout(location = 1) in vec2 aPosition;
layout(location = 2) in vec3 aColor;

out vec3 vColour;

void main() {
    gl_Position = vec4(aPosition,0.,1.);
    gl_PointSize = aPointSize;
    vColour = aColor;
}`;

const fragmentShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

in vec3 vColour;

out vec4 fragColor; 

void main() {
  fragColor = vec4(vColour,1.);
}`;

gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
gl.attachShader(program, vertexShader);

gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
gl.attachShader(program, fragmentShader);

const aPointSizeLoc = 0;
const aPositionLoc = 1;
const aColorLoc = 2;

gl.enableVertexAttribArray(aPointSizeLoc);
gl.enableVertexAttribArray(aPositionLoc);
gl.enableVertexAttribArray(aColorLoc);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.log(gl.getShaderInfoLog(vertexShader));
  console.log(gl.getShaderInfoLog(fragmentShader));
}

gl.useProgram(program);

const bufferData = new Float32Array([
  100,      0, 1,         1, 0, 0, 
  20,       -1, -1,    0, 1, 0, 
  150,      1, -1,      0, 0, 1,
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);

gl.vertexAttribPointer(aPointSizeLoc, 1, gl.FLOAT, false, 6 * 4, 0);
gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 6 * 4, 1 * 4);
gl.vertexAttribPointer(aColorLoc, 3, gl.FLOAT, false, 6 * 4,3 * 4);

gl.drawArrays(gl.TRIANGLES, 0, 3);

// need to add:

// 1. Camera support - can mimic this on the software side
// 2. Hex Mesh -
// 3. Hex placement
// 4. Hex shader
// 5. More complicated hex mesh
// 6. Layout trees and stuff

const sqrt32 = Math.sqrt(3) / 2;

const hexVerts = [
  0.5,
  sqrt32,
  1,
  0,
  0.5,
  -sqrt32,
  -0.5,
  -sqrt32,
  -1,
  0,
  -0.5,
  sqrt32,
];
