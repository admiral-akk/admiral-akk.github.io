import "./util/array.js";
import {
  DataManager,
  DefaultCompressor,
  DefaultPreprocessor,
} from "./util/compression.js";
import { spawnBuilding } from "./actions/spawnBuilding.js";
import { Camera } from "./components/render/camera.js";
import { createProgram, createPostProcessProgram } from "./renderer/program.js";
import { Renderer } from "./renderer/renderer.js";
import { Entity, getEntitiesWith } from "./ecs/entity.js";
import { Mesh } from "./components/render/mesh.js";
import { Transform } from "./components/render/transform.js";
import { UpdateMeshTransform } from "./systems/render/updateMeshTransform.js";
import {
  AnimateMeshTransform,
  toHexPosition,
} from "./systems/render/animateMeshTransform.js";
import { MoveCamera } from "./systems/render/moveCamera.js";
import { Collider } from "./components/collider.js";
import { vec3, vec4, mat4, vec2 } from "gl-matrix";
import { NoiseTexture } from "./renderer/noiseTextures.js";
import { Sun } from "./renderer/sun.js";
import { Unit } from "./components/game/unit.js";
import { State, StateMachine } from "./util/stateMachine.js";
import { time } from "./engine/time.js";
import { gl } from "./engine/renderer.js";
import { input } from "./engine/input.js";
import { Selected } from "./components/client/selected.js";
import { Position } from "./systems/util/position.js";
import { Animated, Animation } from "./components/render/animations.js";
import { ApplyAnimations } from "./systems/render/applyAnimations.js";
import { PositionResources } from "./systems/render/positionResources.js";
import { Component } from "./ecs/component.js";
import { Clickable } from "./components/client/clickable.js";
import { Coordinate } from "./components/game/coordinate.js";
import { UpgradePositions } from "./systems/render/upgradePositions.js";
import { UpgradeBuildings } from "./systems/game/upgradeBuildings.js";
import { connectResource } from "./actions/connectResource.js";
import { UpdateResourceActive } from "./systems/render/updateResourceActive.js";
import { CheckProducer } from "./systems/game/checkProducer.js";
import { UpdateInputSatisfied } from "./systems/render/updateInputSatisfied.js";
import { CollectVisibleMeshInstances } from "./systems/render/collectVisibleMeshes.js";
import {
  fragmentShaderSource,
  quadFragmentShaderSource,
  renderTextureSource,
  vertexShaderSource,
  wireFrameFrag,
  wireFrameVertex,
} from "./shaders.js";

const dataManager = new DataManager(
  new DefaultCompressor(),
  new DefaultPreprocessor()
);

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

// to spawn around 0,0, we need
//

const gameSystems = [new CheckProducer(), new UpgradeBuildings()];

const meshInstances = new CollectVisibleMeshInstances();

const renderSystems = [
  new MoveCamera(),
  new PositionResources(),
  new UpgradePositions(),
  new UpdateResourceActive(),
  new UpdateInputSatisfied(),
  new AnimateMeshTransform(),
  new ApplyAnimations(),
  new UpdateMeshTransform(),
  meshInstances,
];

const systems = [...gameSystems, ...renderSystems];

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

// two kinds of steps - animation and game action
//
// idea for animation:
// have an "animation stack" for things, so that the game state can be ahead of the animation

const applySystems = () => {
  for (let systemIndex = 0; systemIndex < systems.length; systemIndex++) {
    systems[systemIndex].run();
  }
};

const step = () => {
  // handle user input
  applyActions();

  // step through system
  applySystems();
  //updateHexFrustumBounds();
};

var vertex_buffer = gl.createBuffer();
const renderer = new Renderer(gl);
const noise = new NoiseTexture(gl);
const sunShadowMap = new Sun(gl);

noise.generateSmoothValueNoise(renderer, [256, 256]);
noise.generateValueNoise(renderer, [256, 256]);

const renderInputState = () => {};

const draw = () => {
  inputManager.update();
  time.tick();
  requestAnimationFrame(draw);

  step();

  sunShadowMap.renderShadowDepth();

  const setUniforms = (program) => {
    renderer.applyUniforms(cameraEntity.components.camera, program);

    let textureMatrix = mat4.create();
    mat4.translate(textureMatrix, textureMatrix, [0.5, 0.5, 0.5]);
    mat4.scale(textureMatrix, textureMatrix, [0.5, 0.5, 0.5]);
    mat4.multiply(textureMatrix, textureMatrix, sunShadowMap.projection);

    const viewInv = mat4.clone(sunShadowMap.view);

    mat4.multiply(textureMatrix, textureMatrix, viewInv);

    gl.uniformMatrix4fv(
      gl.getUniformLocation(program, "uShadowVP"),
      false,
      textureMatrix
    );
    const shadowLoc = 10;
    const smoothNoiseLoc = 11;
    gl.activeTexture(gl.TEXTURE0 + smoothNoiseLoc);
    gl.bindTexture(gl.TEXTURE_2D, noise.smoothValueNoiseTex);
    gl.uniform1i(
      gl.getUniformLocation(program, "uSmoothNoiseSampler"),
      smoothNoiseLoc
    );
    gl.activeTexture(gl.TEXTURE0 + shadowLoc);
    gl.bindTexture(gl.TEXTURE_2D, sunShadowMap.depthTexture);
    gl.uniform1i(
      gl.getUniformLocation(program, "uShadowMapSampler"),
      shadowLoc
    );
    gl.uniform1f(gl.getUniformLocation(program, "uTime"), time.time);
    // TODO: good abstraction around uniforms
    //
    // need to handle ints vs floats vs matrices vs textures cleanly.
    gl.activeTexture(gl.TEXTURE0 + 1);
    gl.bindTexture(gl.TEXTURE_2D, noise.valueNoiseTex);
    gl.bindTexture(gl.TEXTURE_2D, noise.smoothValueNoiseTex);
    gl.uniform1i(gl.getUniformLocation(program, "uSampler1"), 1);
    sunShadowMap.setUniform(program);
  };
  gl.bindFramebuffer(gl.FRAMEBUFFER, renderer.fbo);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  renderer.render(program, setUniforms, meshInstances.visibleMeshInstances);

  // Step 2: Draw the quad and pick a texture to render
  gl.useProgram(quadProgram);

  // TODO: good abstraction around uniforms
  //
  // need to handle ints vs floats vs matrices vs textures cleanly.
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

  renderInputState();
  if (debugVertices.length > 0) {
    gl.useProgram(wireFrameProgram);
    // Enable the depth test

    // Clear the color and depth buffer
    renderer.applyUniforms(cameraEntity.components.camera, wireFrameProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
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
  Component.checkUnallocatedComponents();
  return;
  gl.useProgram(renderTexture);
  gl.activeTexture(gl.TEXTURE0 + 3);
  gl.bindTexture(gl.TEXTURE_2D, sunShadowMap.depthTexture);
  gl.uniform1i(gl.getUniformLocation(renderTexture, "uTexture"), 3);

  renderer.renderPostProcess(renderTexture);
};

draw();
