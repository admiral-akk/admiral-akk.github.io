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

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aColor;
layout(location = 2) in mat4 aModel;

out vec3 vColor;
out vec2 vUv;
out vec4 vPos;

void main() {
    vPos = aModel * vec4(aPosition,1.);

    gl_Position = uProjection * uView * vPos;
    vUv = aPosition.xz;
    vColor = aColor;
}`;

const fragmentShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

in vec3 vColor;
in vec2 vUv;
in vec4 vPos;

uniform sampler2D uSampler;

out vec4 fragColor; 

void main() {
  float noiseVal = texture(uSampler, 0.9 * vPos.xz).r;
  float dist = smoothstep(0.3,0.35,length(vUv)-  0.4 * noiseVal);

  fragColor = vec4((dist / 2. + 0.5) * vColor, 1.);
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

vec3.pushAll = (vec, arr) => {
  arr.push(vec[0], vec[1], vec[2]);
};

const generateHexVerts = () => {
  const hex = [];
  const baseWidth = 0.8;
  const flareWidth = 0.2;
  const flareDepth = 0.1;
  const baseDepth = 0.15;
  for (let i = 0; i < 6; i++) {
    const angle = ((i + 0.5) * Math.PI * 2) / 6;
    const v = vec3.create();
    v[0] = Math.sin(angle);
    v[1] = 0;
    v[2] = Math.cos(angle);
    vec3.scale(v, v, baseWidth);
    hex.push(v);
  }

  const verts = [];

  for (let i = 0; i < 4; i++) {
    vec3.pushAll(hex[0], verts);
    verts.push(0, 0.4, 0);
    for (let j = 1; j < 3; j++) {
      vec3.pushAll(hex[(i + j) % 6], verts);
      verts.push(0, 0.4, 0);
    }
  }

  for (let i = 0; i < 6; i++) {
    const v1 = vec3.create();
    const v2 = vec3.create();
    const v3 = vec3.create();
    const v4 = vec3.create();
    vec3.copy(v1, hex[i % 6]);
    vec3.copy(v2, hex[(i + 1) % 6]);
    vec3.copy(v3, v1);
    vec3.copy(v4, v2);
    vec3.scale(v3, v3, (baseWidth + flareWidth) / baseWidth);
    vec3.scale(v4, v4, (baseWidth + flareWidth) / baseWidth);

    v3[1] = -flareDepth;
    v4[1] = -flareDepth;

    vec3.pushAll(v1, verts);
    verts.push(0.4, 0.4, 0.0);
    vec3.pushAll(v2, verts);
    verts.push(0.4, 0.4, 0.0);
    vec3.pushAll(v3, verts);
    verts.push(0.4, 0.4, 0.0);
    vec3.pushAll(v4, verts);
    verts.push(0.4, 0.4, 0.0);
    vec3.pushAll(v2, verts);
    verts.push(0.4, 0.4, 0.0);
    vec3.pushAll(v3, verts);
    verts.push(0.4, 0.4, 0.0);

    vec3.scale(v1, v1, (baseWidth + flareWidth) / baseWidth);
    vec3.scale(v2, v2, (baseWidth + flareWidth) / baseWidth);
    v1[1] = -flareDepth;
    v2[1] = -flareDepth;
    v3[1] -= baseDepth;
    v4[1] -= baseDepth;

    vec3.pushAll(v1, verts);
    verts.push(0.4, 0.4, 0.0);
    vec3.pushAll(v2, verts);
    verts.push(0.4, 0.4, 0.0);
    vec3.pushAll(v3, verts);
    verts.push(0.4, 0.4, 0.0);
    vec3.pushAll(v4, verts);
    verts.push(0.4, 0.4, 0.0);
    vec3.pushAll(v2, verts);
    verts.push(0.4, 0.4, 0.0);
    vec3.pushAll(v3, verts);
    verts.push(0.4, 0.4, 0.0);
  }

  return verts;
};

const hexVerts = generateHexVerts();
console.log(hexVerts);
[
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

const xDim = 2;
const yDim = 2;
for (let x = 0; x < xDim; x++) {
  for (let y = 0; y < yDim; y++) {
    const model = mat4.create();
    const xOffset = 1.5 * (x - (xDim - 1) / 2);
    const yOffset = 2 * sqrt32 * (y - (yDim - 1) / 2 + (x % 2 === 0 ? 0.5 : 0));
    mat4.translate(model, model, [xOffset, 0, yOffset]);
    mat4.scale(model, model, [0.9, 0.9, 0.9]);
    for (let j = 0; j < model.length; j++) {
      transformArray.push(model[j]);
    }
  }
}

const transformData = new Float32Array(transformArray);

//

const vao1 = gl.createVertexArray();
gl.bindVertexArray(vao1);
const modelBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer);
gl.bufferData(gl.ARRAY_BUFFER, modelData, gl.STATIC_DRAW);
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);

const transformBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
gl.bufferData(gl.ARRAY_BUFFER, transformData, gl.STATIC_DRAW);
gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 16 * 4, 0 * 4);
gl.vertexAttribPointer(3, 4, gl.FLOAT, false, 16 * 4, 4 * 4);
gl.vertexAttribPointer(4, 4, gl.FLOAT, false, 16 * 4, 8 * 4);
gl.vertexAttribPointer(5, 4, gl.FLOAT, false, 16 * 4, 12 * 4);

gl.vertexAttribDivisor(2, 1);
gl.vertexAttribDivisor(3, 1);
gl.vertexAttribDivisor(4, 1);
gl.vertexAttribDivisor(5, 1);

gl.enableVertexAttribArray(2);
gl.enableVertexAttribArray(3);
gl.enableVertexAttribArray(4);
gl.enableVertexAttribArray(5);

gl.bindVertexArray(null);

const viewLoc = gl.getUniformLocation(program, "uView");
const projectionLoc = gl.getUniformLocation(program, "uProjection");
const textureLoc = gl.getUniformLocation(program, "uNoiseTexture");

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
cameraPos[0] = -1.4;
cameraPos[1] = 2;
const origin = vec3.create();

const draw = () => {
  requestAnimationFrame(draw);

  vec3.rotateY(cameraPos, cameraPos, origin, 0.002);
  mat4.lookAt(view, cameraPos, origin, [0, 1, 0]);
  gl.uniformMatrix4fv(viewLoc, false, view);
  gl.uniformMatrix4fv(projectionLoc, false, projection);
  gl.bindVertexArray(vao1);
  gl.drawArraysInstanced(gl.TRIANGLES, 0, modelData.length, xDim * yDim);
  gl.bindVertexArray(null);
};
const loadImage = () =>
  new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.src = "./noiseTexture.png";
  });

const run = async () => {
  const image = await loadImage();
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGB,
    256,
    256,
    0,
    gl.RGB,
    gl.UNSIGNED_BYTE,
    image
  );
  gl.enable(gl.DEPTH_TEST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  draw();
};

run();

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
