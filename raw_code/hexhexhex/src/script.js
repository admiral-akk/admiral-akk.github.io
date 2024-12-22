import {
  DataManager,
  DefaultCompressor,
  DefaultPreprocessor,
} from "./util/compression.js";
import { WindowManager } from "./util/window.js";
import { mat4 } from "gl-matrix";
import { generateRegularPolygon, generateSymmetricMesh } from "./mesh.js";
import { Camera } from "./camera.js";
import { Program } from "./program.js";
import { InstancedMesh } from "./instancedMesh.js";

const dataManager = new DataManager(
  new DefaultCompressor(),
  new DefaultPreprocessor()
);
const windowManager = new WindowManager(16 / 9);
const gl = windowManager.canvas.getContext("webgl2");

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

const flatFragmentShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

in vec3 vColor;
in vec2 vUv;
in vec4 vPos;
in vec4 vCoordinates;

uniform sampler2D uSampler;

out vec4 fragColor; 

void main() {
  fragColor = vec4(vColor, 1.);
}`;

const program = new Program(gl, vertexShaderSource, fragmentShaderSource);
const flatProgram = new Program(
  gl,
  vertexShaderSource,
  flatFragmentShaderSource
);

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

const xDim = 10;
const yDim = 10;
const instancedMesh = new InstancedMesh(gl, generateHexVerts(), xDim * yDim);
for (let x = 0; x < xDim; x++) {
  for (let y = 0; y < yDim; y++) {
    const model = mat4.create();
    const xOffset = 1.5 * (x - (xDim - 1) / 2);
    const yOffset = 2 * sqrt32 * (y - (yDim - 1) / 2 + (x % 2 === 0 ? 0.5 : 0));
    mat4.translate(model, model, [xOffset, 0, yOffset]);
    mat4.scale(model, model, [0.9, 0.9, 0.9]);
    instancedMesh.updateTransform(gl, x + y * xDim, model);
    instancedMesh.updateCoordinates(gl, x + y * xDim, [
      Math.floor(x - xDim / 2),
      Math.floor(y - yDim / 2),
    ]);
  }
}

const backgroundInstance = new InstancedMesh(
  gl,
  generateSymmetricMesh(
    [[0, 1, [123 / 255, 217 / 255, 246 / 255]]],
    generateRegularPolygon(4, 100)
  ),
  1
);

const model = mat4.create();
mat4.translate(model, model, [0, -2, 0]);
backgroundInstance.updateTransform(gl, 0, model);

const camera = new Camera();

const draw = () => {
  requestAnimationFrame(draw);

  gl.useProgram(program.program);
  camera.rotateCamera();
  camera.applyCameraUniforms(gl, program.program);
  instancedMesh.render(gl);
  gl.useProgram(flatProgram.program);
  camera.applyCameraUniforms(gl, flatProgram.program);
  backgroundInstance.render(gl);
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
