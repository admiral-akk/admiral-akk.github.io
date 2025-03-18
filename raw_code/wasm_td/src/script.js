import "./util/array.js";
import {
  DataManager,
  DefaultCompressor,
  DefaultPreprocessor,
} from "./util/compression.js";
import {
  createProgram,
  createPostProcessProgram,
} from "./engine/renderer/program.js";
import { Renderer } from "./engine/renderer.js";
import { Entity } from "./engine/ecs/entity.js";
import { Transform } from "./components/render/transform.js";
import { NoiseTexture } from "./engine/renderer/noiseTextures.js";
import { Sun } from "./engine/renderer/sun.js";
import { time } from "./engine/time.js";
import { gl } from "./engine/renderer.js";
import { input } from "./engine/input.js";
import { Component } from "./engine/ecs/component.js";
import {
  fragmentShaderSource,
  quadFragmentShaderSource,
  renderTextureSource,
  vertexShaderSource,
  wireFrameFrag,
  wireFrameVertex,
} from "./shaders.js";
import { applySystems, meshInstances } from "./systems/system.js";
import { applyCameraUniforms } from "./engine/renderer/camera.js";
import { Mesh } from "./components/render/mesh.js";
import { Vec3 } from "gl-matrix";
import Stats from "stats.js";
import {
  Vec3 as wasmVec3,
  TerrainGenerator,
  TreeGenerator,
  ModelGenerator,
  CubeGenerator,
} from "./wasm/testing_wasm.js";
import { FrustumCulling } from "./systems/render/frustumCulling.js";
import { GenerateChunks } from "./systems/render/generateChunks.js";
import { BoxCollider } from "./components/collider.js";
import { getCollision } from "./raycaster.js";
import { Clickable } from "./components/client/clickable.js";
import { InputManager } from "./input/inputManager.js";
import { RiggedCamera } from "./entities/riggedCamera.js";

const v = new wasmVec3(1, 2, 3);
const other = new wasmVec3(4, 5, 6);

const dataManager = new DataManager(
  new DefaultCompressor(),
  new DefaultPreprocessor()
);
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);
const wireFrameProgram = createProgram(gl, wireFrameVertex, wireFrameFrag);
const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
const quadProgram = createPostProcessProgram(gl, quadFragmentShaderSource);
const renderTexture = createPostProcessProgram(gl, renderTextureSource);

const cameraEntity = new RiggedCamera();

var debugVertices = [];

const inputManager = new InputManager();

// defines some functionality that changes the state of the game / rendering?
// do commands carry with them the parsing info?
//
// nah - make 'em just data payloads.
//
// then it's just type + data, right?
const applyActions = () => {
  const actions = inputManager.commands;
  for (let i = 0; i < actions.length; i++) {
    actions[i].apply();
  }
  actions.length = 0;
};

const renderer = new Renderer(gl);
const noise = new NoiseTexture(gl);
const sunShadowMap = new Sun(gl);

noise.generateSmoothValueNoise(renderer, [256, 256]);
noise.generateValueNoise(renderer, [256, 256]);

const renderPostProcess = () => {
  gl.useProgram(quadProgram);

  gl.uniform3fv(
    gl.getUniformLocation(quadProgram, "uBackgroundColor"),

    new Float32Array([123 / 255, 217 / 255, 246 / 255])
  );

  const pointerPos = input.state?.mpos_clamped?.val ?? [0.5, 0.5];
  gl.uniform2fv(
    gl.getUniformLocation(quadProgram, "uPointerPos"),

    new Float32Array([pointerPos[0], 1 - pointerPos[1]])
  );

  renderer.renderPostProcess(quadProgram);
};

const debugVertexBuffer = gl.createBuffer();
const renderDebug = () => {
  if (debugVertices.length > 0) {
    gl.useProgram(wireFrameProgram);
    // Enable the depth test

    // Clear the color and depth buffer
    renderer.applyUniforms(cameraEntity.components.camera, wireFrameProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, debugVertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(debugVertices),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
    gl.enableVertexAttribArray(0);
    gl.drawArrays(gl.LINES, 0, debugVertices.length / 3);
    gl.flush();
  }
};

FrustumCulling.setActiveCamera(cameraEntity.components.camera);

// 20 x 20 grey floor
const t = new TerrainGenerator(40);
const tree = new TreeGenerator();
const cubeGen = new CubeGenerator();

const modelGen = new ModelGenerator();

modelGen.generate_model("red_cube", {
  CurveModel: {
    curve: [
      [1.5, -1.5],
      [1.5, 1.5],
    ],
    color_curve: [
      [-1.5, [0.15, 0, 0]],
      [1.5, [0.7, 0, 0]],
    ],
    points: 4,
    close_top: true,
    close_bot: true,
  },
});

modelGen.generate_model("composite_red_cube", {
  CompositeModel: {
    references: [
      { name: "red_cube", transform: {} },
      {
        name: "red_cube",
        transform: {
          scale: [0.5, 0.5, 0.5],
          translation: [0, 2, 0],
        },
      },
    ],
  },
});

modelGen.generate_model("red_cube2", {
  ExtrudeModel: {
    base: [
      [-0.5, -0.5],
      [0.5, -0.5],
      [0.5, 0.5],
      [-0.5, 0.5],
    ],
    close_bot: true,
    close_top: true,
    transforms: [
      { translation: [0, 1, 0] },
      { translation: [0, 0.2, 0], scale: [0, 1, 1] },
    ],
  },
});
const redCube2 = modelGen.get_mesh("red_cube2");
const redCube = cubeGen.generate_mesh(
  new wasmVec3(1, 1, 1),
  new wasmVec3(1, 0, 0)
);
const blueCube = cubeGen.generate_mesh(
  new wasmVec3(Math.sqrt(200), 1, Math.sqrt(200)),
  new wasmVec3(0, 0, 0.5)
);

new Entity(new Mesh(redCube2), new Transform({ pos: new Vec3(0, 1, 0) }));
const collider = new Entity(
  new Transform({ pos: new Vec3(0, 0, 0) }),
  new BoxCollider([5, 0.5, 5]),
  new Mesh(blueCube),
  new Clickable()
);

const texture = gl.createTexture();
{
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 2;
  const height = 2;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([
    0, 0, 255, 255, 0, 255, 0, 255, 255, 0, 0, 255, 0, 0, 255, 255,
  ]); // opaque blue
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );
  gl.generateMipmap(gl.TEXTURE_2D);
}

GenerateChunks.setTerrainGenerator(t);
GenerateChunks.setTreeGenerator(tree);

const draw = () => {
  stats.begin();
  inputManager.update(input);
  time.tick();

  const collision = getCollision(
    input.state,
    cameraEntity.components.transform,
    cameraEntity.components.camera
  );
  // handle user input
  applyActions();

  // step through system
  applySystems();

  sunShadowMap.renderShadowDepth(cameraEntity.components);

  const setUniforms = (program) => {
    applyCameraUniforms(cameraEntity.components, program);
    sunShadowMap.setUniforms(gl, program);
    time.setUniforms(gl, program);

    const shadowLoc = 4;
    gl.activeTexture(gl.TEXTURE0 + shadowLoc);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(gl.getUniformLocation(program, "uCustomTexture"), shadowLoc);
  };
  gl.bindFramebuffer(gl.FRAMEBUFFER, renderer.fbo);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  renderer.render(program, setUniforms, meshInstances.visibleMeshInstances);

  renderPostProcess();
  renderDebug();
  Component.checkUnallocatedComponents();
  stats.end();
  requestAnimationFrame(draw);
};

draw();
