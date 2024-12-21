import {
  DataManager,
  DefaultCompressor,
  DefaultPreprocessor,
} from "./util/compression.js";
import { WindowManager } from "./util/window.js";
import { mat4, vec3 } from "gl-matrix";
import { generateRegularPolygon, generateSymmetricMesh } from "./mesh.js";
import { Camera } from "./camera.js";

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
layout(location = 6) in vec4 aCoordinates;

out vec3 vColor;
out vec2 vUv;
out vec4 vPos;
out vec4 vCoordinates;

void main() {
    vPos = aModel * vec4(aPosition,1.);

    gl_Position = uProjection * uView * vPos;
    vUv = aPosition.xz;
    vColor = aColor;
    vCoordinates = aCoordinates;
}`;

const fragmentShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

in vec3 vColor;
in vec2 vUv;
in vec4 vPos;
in vec4 vCoordinates;

uniform sampler2D uSampler;

out vec4 fragColor; 

void main() {
  float noiseVal = texture(uSampler, 0.9 * vPos.xz).r;
  float dist = smoothstep(0.3,0.35,length(vUv)-  0.4 * noiseVal);

  float distFromZero = length(vCoordinates.xy);


  fragColor = vec4((dist / 2. + 0.5 - distFromZero / 4.) * vColor, 1.);
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

const sqrt32 = Math.sqrt(3) / 2;

const generateHexVerts = () => {
  const params = [
    [-0.5, 1, [0.3, 0.3, 0.3]],
    [-0.25, 1, [0.4, 0.4, 0.0]],
    [0, 0.8, [0.0, 0.4, 0.0]],
  ];
  const hexVerts = generateRegularPolygon(6, 1);
  return generateSymmetricMesh(params, hexVerts);
};

const modelData = new Float32Array(generateHexVerts());

const transformArray = [];

const xDim = 10;
const yDim = 10;
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
    transformArray.push(
      Math.floor(x - xDim / 2),
      Math.floor(y - yDim / 2),
      0,
      0
    );
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
cameraPos[0] = 4;
cameraPos[1] = 4;
const origin = vec3.create();
const camera = new Camera();

const draw = () => {
  requestAnimationFrame(draw);

  gl.useProgram(program);
  camera.rotateCamera();
  camera.applyCameraUniforms(gl, program);
  gl.bindVertexArray(vao1);
  gl.drawArraysInstanced(gl.TRIANGLES, 0, modelData.length / 6, xDim * yDim);
  gl.bindVertexArray(null);
};
const loadImage = (src) =>
  new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.src = src;
  });

const run = async () => {
  const image = await loadImage("./kitten.png");
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
