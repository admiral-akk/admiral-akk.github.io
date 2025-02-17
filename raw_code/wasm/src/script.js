import "./util/array.js";
import {
  DataManager,
  DefaultCompressor,
  DefaultPreprocessor,
} from "./util/compression.js";
import { Camera } from "./components/render/camera.js";
import { createProgram, createPostProcessProgram } from "./renderer/program.js";
import { Renderer } from "./renderer/renderer.js";
import { Entity } from "./ecs/entity.js";
import { Transform } from "./components/render/transform.js";
import { NoiseTexture } from "./renderer/noiseTextures.js";
import { Sun } from "./renderer/sun.js";
import { State, StateMachine } from "./util/stateMachine.js";
import { time } from "./engine/time.js";
import { gl } from "./engine/renderer.js";
import { input } from "./engine/input.js";
import { Component } from "./ecs/component.js";
import {
  fragmentShaderSource,
  quadFragmentShaderSource,
  renderTextureSource,
  vertexShaderSource,
  wireFrameFrag,
  wireFrameVertex,
} from "./shaders.js";
import { applySystems, meshInstances } from "./systems/system.js";
import { applyCameraUniforms } from "./renderer/camera.js";
import { Mesh } from "./components/render/mesh.js";
import { Vec3, Vec2, Quat } from "gl-matrix";
import Stats from "stats.js";
import {
  Vec3 as wasmVec3,
  TerrainGenerator,
  TreeGenerator,
} from "./wasm/testing_wasm.js";
import { FrustumCulling } from "./systems/render/frustumCulling.js";
import { Position } from "./systems/util/position.js";
import { GenerateChunks } from "./systems/render/generateChunks.js";

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

const cameraBaseT = new Transform({ pos: [0, 0, 0] });

const horizontalRotT = new Transform({
  parent: cameraBaseT,
  rot: Quat.create().rotateY(-Math.PI / 4),
});

const verticalRotT = new Transform({
  parent: horizontalRotT,
  rot: Quat.create().rotateX(Math.PI / 4),
});

const zoomT = new Transform({
  parent: verticalRotT,
  pos: [0, 0, -10],
});

const cameraBase = new Entity(cameraBaseT);
const cameraZoomOut3 = new Entity(horizontalRotT);
const cameraZoomOut2 = new Entity(verticalRotT);
const cameraZoomOut = new Entity(zoomT);

const cameraEntity = new Entity(
  new Camera(gl),
  new Transform({
    parent: zoomT,
  })
);

var debugVertices = [];

// input manager - client, determines commands
// commands figure out how to apply themselves
// then the state game actions happen
// then we apply a render

// TODO: add a notion of "commands"

// decides what commands a user will issue, if any
//
// commands might be illegal in the game state.
class InputManager extends StateMachine {
  constructor() {
    super();
    this.pushState(new OpenState());
    this.commands = [];
  }

  update() {
    const { state } = input;

    this.currentState().handleInput(this);
  }
}

class OpenState extends State {
  handleInput(manager) {
    const { state } = input;

    const move = Vec3.create();

    if (state?.w?.val) {
      move[2] += 1;
    }

    if (state?.s?.val) {
      move[2] -= 1;
    }
    if (state?.a?.val) {
      move[0] += 1;
    }
    if (state?.d?.val) {
      move[0] -= 1;
    }

    const invRot = Quat.clone(horizontalRotT.rot).invert();

    Vec3.transformQuat(move, move, invRot);
    Vec3.add(cameraBaseT.pos, cameraBaseT.pos, move);

    cameraBaseT.setPosition(cameraBaseT.pos);

    horizontalRotT.rot.rotateY(
      (0.05 * ((state?.q?.val ?? 0) - (state?.e?.val ?? 0))) / Math.PI
    );
    horizontalRotT.setRotation(horizontalRotT.rot);

    if (
      state?.rmb?.val === 1 &&
      state?.mpos?.frame === time.frame &&
      state?.mpos?.prev?.val
    ) {
      const delta = Vec2.clone(state.mpos.val).sub(state?.mpos?.prev.val);
      horizontalRotT.rot.rotateY((5 * delta.x) / Math.PI);
      verticalRotT.rot.rotateX(5 * delta.y);
      horizontalRotT.setRotation(horizontalRotT.rot);
      verticalRotT.setRotation(verticalRotT.rot);
    }
    if (
      state?.wheel?.frame === time.frame &&
      state?.wheel?.prev?.val !== state?.wheel?.val
    ) {
      const deltaY = state.wheel.val - state.wheel.prev.val;
      zoomT.pos[2] -= 0.05 * deltaY;
      zoomT.pos[2] = Math.clamp(zoomT.pos[2], -25, -4);
      zoomT.setPosition(zoomT.pos);
    }
  }
}

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
    const action = actions[i];
    switch (action.type) {
      default:
        break;
    }
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

const treeMesh = tree.generate_mesh();

for (let x = -4; x <= 4; x++) {
  for (let y = -4; y <= 4; y++) {
    new Entity(
      new Transform({ pos: Vec3.clone([x, 2, y]) }),
      new Mesh(treeMesh)
    );
  }
}

GenerateChunks.setTerrainGenerator(t);

//createThing();
const draw = () => {
  stats.begin();
  inputManager.update();
  time.tick();

  // handle user input
  applyActions();

  // step through system
  applySystems();

  sunShadowMap.renderShadowDepth(cameraEntity.components);

  const setUniforms = (program) => {
    applyCameraUniforms(cameraEntity.components, program);
    sunShadowMap.setUniforms(program);
    time.setUniforms(program);
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
