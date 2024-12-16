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

layout(location = 0) in vec2 aPosition;
layout(location = 1) in vec2 aUv;

out vec2 vUv;

void main() {
    gl_Position = vec4(aPosition,0.,1.);
    vUv = aUv;
}`;

const fragmentShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

uniform sampler2D uSampler1;
uniform sampler2D uSampler2;

in vec2 vUv;

out vec4 fragColor; 

void main() {
  fragColor = texture(uSampler1, vUv) *texture(uSampler2, vUv) ;
}`;

gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
gl.attachShader(program, vertexShader);

gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
gl.attachShader(program, fragmentShader);

const aPositionLoc = 0;
const aUvLoc = 1;

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.log(gl.getShaderInfoLog(vertexShader));
  console.log(gl.getShaderInfoLog(fragmentShader));
}

gl.useProgram(program);

const bufferData = new Float32Array([
   0, 1,  0.5, 1,
  -1, -1, 0, 0,
  1, -1,  1, 0
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);


const pixels = new Uint8Array([
	255,255,255,		230,25,75,			60,180,75,			255,225,25,
	67,99,216,			245,130,49,			145,30,180,			70,240,240,
	240,50,230,			188,246,12,			250,190,190,		0,128,128,
	230,190,255,		154,99,36,			255,250,200,		0,0,0,
]);
gl.vertexAttrib2f(aPositionLoc, 0.25,0.25);
gl.vertexAttrib2f(aUvLoc, 0.25,0.25);

gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 4 * 4, 0 * 4);
gl.vertexAttribPointer(aUvLoc, 2, gl.FLOAT, false, 4 * 4, 2 * 4);

gl.enableVertexAttribArray(aPositionLoc);
gl.enableVertexAttribArray(aUvLoc);

const loadImage = () => new Promise(resolve => {
  const image = new Image();
  image.addEventListener('load', () => resolve(image))
  image.src= './kitten.png'
})

const run = async () => {
  const image = await loadImage();

  const pixelTextureUnit = 0;
  const kittenTextureUnit = 5;

  gl.uniform1i(gl.getUniformLocation(program, 'uSampler1'), kittenTextureUnit);
  gl.uniform1i(gl.getUniformLocation(program, 'uSampler2'), pixelTextureUnit);

  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + 5);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 500,300,0,gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);

  const texture2 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture2);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 4,4,0,gl.RGB, gl.UNSIGNED_BYTE, pixels);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.generateMipmap(gl.TEXTURE_2D);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

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
