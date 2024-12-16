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

uniform vec2 uPosition;
uniform float uPointSize;

void main() {
    gl_Position = vec4(uPosition,0.,1.);
    gl_PointSize = uPointSize;
}`;

const fragmentShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

uniform int uIndex;
uniform vec4 uColors[3];

out vec4 fragColor; 

void main() {
  fragColor = uColors[uIndex];
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

const uPositionLoc = gl.getUniformLocation(program, "uPosition");
const uPointSizeLoc = gl.getUniformLocation(program, "uPointSize");
const uIndexLoc = gl.getUniformLocation(program, "uIndex");
const uColorsLoc = gl.getUniformLocation(program, "uColors");

gl.uniform1f(uPointSizeLoc, 100);
gl.uniform2f(uPositionLoc, 0.5, 0);
gl.uniform1i(uIndexLoc, 2);
gl.uniform4fv(uColorsLoc, [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1]);

gl.drawArrays(gl.POINTS, 0, 1);
gl.uniform1f(uPointSizeLoc, 20);
gl.uniform2f(uPositionLoc, 0.25, 0.05);

gl.drawArrays(gl.POINTS, 0, 1);
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
