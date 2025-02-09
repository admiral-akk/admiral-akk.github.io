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
import { Brush } from "./engine/mesh/brush.js";
import { Plane } from "./engine/mesh/plane.js";
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
import { vec3, quat, Vec3, Vec2, Quat } from "gl-matrix";
import { Triangle } from "./engine/mesh/triangle.js";
import { BrushMesh } from "./engine/mesh/brushMesh.js";
import Stats from "stats.js";

import * as wasm from "./wasm/testing_wasm.js";
import { Vec3 as wasmVec3 } from "./wasm/testing_wasm.js";

const v = new wasmVec3(1, 2, 3);
const other = new wasmVec3(4, 5, 6);

console.log(v.add(other).to_string());
console.log(v.to_string());
console.log(other.to_string());

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

const cameraEntity = new Entity();

{
  cameraEntity.addComponent(new Camera(gl));
  const t = new Transform();
  t.setPosition([0, -4, 0]);
  cameraEntity.addComponent(t);
}

const memory = new WebAssembly.Memory({ initial: 256, maximum: 256 });
const impObj = {
  env: { memory },
};

fetch("add.wasm")
  .then((res) => res.arrayBuffer())
  .then((bytes) => WebAssembly.instantiate(bytes, impObj))
  .then((wasmMod) => console.log(wasmMod.instance.exports.add(2, 3)));

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

    if (state?.rmb?.val === 1 && state?.mpos?.frame === time.frame) {
      const delta = Vec2.clone(state.mpos.val).sub(state.mpos.prev.val);
      cameraEntity.components.camera.xAngle += 10 * delta.x;
      cameraEntity.components.camera.yAngle += 10 * delta.y;
      cameraEntity.components.camera.yAngle = Math.clamp(
        cameraEntity.components.camera.yAngle,
        (-1 * Math.PI) / 3,
        (1 * Math.PI) / 3
      );
    }

    if (state?.wheel?.frame === time.frame) {
      cameraEntity.components.camera.distance +=
        (state.wheel.val - state.wheel.prev.val) / 400;
      cameraEntity.components.camera.distance = Math.clamp(
        cameraEntity.components.camera.distance,
        1,
        10
      );
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

  const pointerPos = input.state?.mpos?.val ?? [0.5, 0.5];
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

const generatePyramid = () => {
  const resourceSize = 1;
  const color = [0.45, 0.25, 0];
  const color2 = [0.45, 0.25, 0.4];

  const directions = [new Vec3(1, 0, 0), new Vec3(0, 1, 0), new Vec3(0, 0, 1)];

  const planes = [];

  planes.push(new Plane(new Vec3(0, 1, 0), 0, { color }));
  planes.push(new Plane(new Vec3(1, -1, 0), -1, { color }));
  planes.push(new Plane(new Vec3(-1, -1, 0), -1, { color }));
  planes.push(new Plane(new Vec3(0, -1, -1), -1, { color }));
  planes.push(new Plane(new Vec3(0, -1, 1), -1, { color }));
  //planes.push(new Plane(new Vec3(0, -1, 0), -0.4, { color }));
  const brush = new Brush(planes);
  return new BrushMesh(brush);
};

const generateBox = () => {
  const resourceSize = 1;
  const color = [0.45, 0.25, 0];
  const color2 = [0.45, 0.25, 0.4];

  const directions = [new Vec3(1, 0, 0), new Vec3(0, 1, 0), new Vec3(0, 0, 1)];

  const planes = [];

  for (let i = 0; i < directions.length; i++) {
    const dir = directions[i];
    planes.push(new Plane(dir.clone().scale(resourceSize), -1, { color }));
    planes.push(new Plane(dir.clone().scale(-resourceSize), -1, { color }));
  }

  planes.push(
    new Plane(Vec3.clone([1, 1, 1]).normalize(), 0, { color: color2 })
  );
  const brush = new Brush(planes);
  return new BrushMesh(brush);
};

const createThing = () => {
  const color = [0.45, 0.25, 0];
  const color2 = [0.45, 0.25, 0.4];
  const brushMesh = new BrushMesh(Brush.regularPrism(1, 3, 1, { color }));
  brushMesh.rotation = new Quat().rotateZ(Math.PI / 2);
  const brushMesh2 = new BrushMesh(
    Brush.regularPrism(0.75, 3, 1.4, { color2 })
  );
  brushMesh2.rotation = new Quat().rotateZ(Math.PI / 2).rotateX(Math.PI / 3);

  brushMesh.add(brushMesh2);

  const modelTriangle = brushMesh.triangles();
  const modelArray = [];
  modelTriangle.forEach((tri) => Triangle.pushVertices(tri, modelArray));
  return new Entity(new Transform(), new Mesh(modelArray));
};

createThing();
const draw = () => {
  stats.begin();
  inputManager.update();
  time.tick();

  // handle user input
  applyActions();

  // step through system
  applySystems();

  sunShadowMap.renderShadowDepth();

  const setUniforms = (program) => {
    applyCameraUniforms(cameraEntity.components.camera, program);
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
