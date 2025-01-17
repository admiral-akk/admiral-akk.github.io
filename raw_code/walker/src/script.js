import "./util/array.js";
import {
  DataManager,
  DefaultCompressor,
  DefaultPreprocessor,
} from "./util/compression.js";
import {
  generateRegularPolygon,
  generateSymmetricMesh,
} from "./renderer/mesh.js";
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
import { MarkSelected } from "./systems/render/markSelected.js";
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

const dataManager = new DataManager(
  new DefaultCompressor(),
  new DefaultPreprocessor()
);

const vertexShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: vert

precision mediump float;

uniform mat4 uView;
uniform mat4 uProjection;
uniform mat4 uShadowVP;

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec3 aColor;
layout(location = 3) in mat4 aModel;
layout(location = 7) in vec4 aInstancedMetadata1;
layout(location = 8) in vec4 aInstancedMetadata2;
layout(location = 9) in vec4 aInstancedMetadata3;
layout(location = 10) in vec4 aInstancedMetadata4;

out vec3 vColor;
out vec4 vPos;
out vec4 vTransPos;
out vec4 vInstancedColor;
out vec3 vNormal;
out vec4 vShadowCoord;

void main() {
    vPos = aModel * vec4(aPosition,1.);

    gl_Position = uProjection * uView * vPos;
    vShadowCoord = (uShadowVP * vPos);
    vColor = aColor;
    vNormal = aNormal;
    vTransPos = gl_Position;
    vInstancedColor = aInstancedMetadata1;
}`;

const fragmentShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

layout(std140) uniform Sun {
  vec3 sunColor;
  float sunStrength;
  vec3 ambientColor;
  float ambientStrength;
  vec3 sunDirection;
};

in vec3 vColor;
in vec4 vTransPos;
in vec3 vNormal;
in vec4 vShadowCoord;
in vec4 vInstancedColor;

uniform sampler2D uSampler1;
uniform sampler2D uShadowMapSampler;
uniform ivec4 uClickedCoord;
uniform vec3 uLightDir;

layout(location=0) out vec4 fragColor; 
layout(location=1) out float depth; 

void main() {

  float distFromZero = 0.;

  float lightNorm =  clamp(dot(sunDirection, vNormal),0.,1.);

  vec3 lightColor = ambientStrength * ambientColor + lightNorm * sunStrength * sunColor;

  fragColor = vec4(vColor, 1.);
  vec4 shadowCoord = vShadowCoord / vShadowCoord.w ;
  float shadowDepth = texture(uShadowMapSampler,  shadowCoord.xy ).r;
  float expectedDepth = shadowCoord.z  ;

  float val = 1000.*(expectedDepth - shadowDepth);

  fragColor = vec4(vec3( val), 1.);

  float bias = -0.001;
  float shadowed = float(expectedDepth > shadowDepth + bias);

  float normLDot = dot(sunDirection, vNormal);

  if (normLDot < 0.01) {
    shadowed = 1.;
  }

  if (shadowCoord.x < -0. || shadowCoord.x > 1. || shadowCoord.y < -0. || shadowCoord.y > 1.) {
    shadowed = 0.;
  }

  fragColor = vec4(vColor * (1. - 0.5 * shadowed), 1.);

  fragColor *= vInstancedColor;
  

  //fragColor = vec4(vec3(normLDot ), 1.);

  float far = 10.0; //far plane
  float near =  0.01; //near plane
  depth = 1. - vTransPos.z / (far  - near);

}`;

const wireFrameVertex = `#version 300 es
#pragma vscode_glsllint_stage: vert

precision mediump float;

uniform mat4 uView;
uniform mat4 uProjection;

layout(location = 0) in vec3 aPosition;

void main() {
    gl_Position = uProjection * uView * vec4(aPosition,1.);
}`;

const wireFrameFrag = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

layout(location=0) out vec4 fragColor; 
void main() {
  fragColor = vec4(1.,0.,1., 1.);
}`;

const wireFrameProgram = createProgram(gl, wireFrameVertex, wireFrameFrag);
const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
const quadFragmentShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

uniform sampler2D uDepth;
uniform sampler2D uColor;
uniform vec3 uBackgroundColor;
uniform vec2 uPointerPos;

in vec2 vTexCoord;

out vec4 fragColor;

float linearDepth(float depthSample)
{
float f = 10.0; //far plane
float n = 0.01; //near plane
  return (2.0 * n) / (f + n - depthSample * (f - n));
}
void main()
{
float far = 10.0; //far plane
float near =  0.01; //near plane
float depthTexVal = (1. - texture(uDepth, vTexCoord).x) ;
float depth = near + (1. - texture(uDepth, vTexCoord).x) * (far - near);
float nonLinearDepth = 1. / (depthTexVal * (1. / far + 1. / near) + 1. / near);
  fragColor =  vec4(depth, 0., 0., 1.);
  fragColor =  vec4(depth - 9., 0., 0., 1.);
  fragColor =  vec4(texture(uColor, vTexCoord).rgb, 1.);

  fragColor = mix(fragColor, vec4(uBackgroundColor, 1.), pow(smoothstep(0.45, 1.,depthTexVal), 0.95));
  if (length(vTexCoord - uPointerPos) < 0.01) {
    fragColor = vec4(1.,0.,0.,1.);
  }
  }`;
const renderTextureSource = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

uniform sampler2D uTexture;

in vec2 vTexCoord;

out vec4 fragColor;

void main()
{
  fragColor = vec4(texture(uTexture, vTexCoord).rgb , 1.);
}`;

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

// https://stackoverflow.com/a/56348846
const getWorldRayFromCamera = (cameraEntity, viewPos) => {
  const { camera, transform } = cameraEntity.components;

  const viewX = 2 * (viewPos[0] - 0.5);

  // invert y
  const viewY = 2 * (0.5 - viewPos[1]);

  const near = vec4.clone([viewX, viewY, -1, 1]);
  const far = vec4.clone([viewX, viewY, 1, 1]);
  const view = transform.getWorldMatrix();
  const projection = mat4.clone(camera.projection);

  mat4.multiply(projection, projection, view);
  mat4.invert(projection, projection);

  vec4.transformMat4(near, near, projection);
  vec4.transformMat4(far, far, projection);

  vec4.scale(near, near, 1 / near[3]);
  vec4.scale(far, far, 1 / far[3]);
  vec4.sub(far, far, near);

  const dir = vec3.clone([far[0], far[1], far[2]]);

  vec3.normalize(dir, dir);

  return [vec3.clone(transform.pos), dir];
};

const getRayCollision = (start, dir) => {
  var best = null;
  getEntitiesWith(Collider, Transform, Clickable).forEach((entity) => {
    const { collider, transform } = entity.components;
    if (collider && transform) {
      const r = collider.raycast(start, dir, transform.getWorldMatrix());
      if (r) {
        if (!best) {
          best = [collider, r];
        } else if (
          vec3.distance(start, best[1][0]) > vec3.distance(start, r[0])
        ) {
          best = [collider, r];
        }
      }
    }
  });
  return best;
};

const moveTo = (hexEntity) => {
  getEntitiesWith(Unit, Transform, Animated, Coordinate).forEach((e) => {
    const { transform, animated, coordinate } = e.components;
    const path = Position.path(
      coordinate.pos,
      hexEntity.components.coordinate.pos
    );
    var endTime = animated.animations.max((a) => a.end)?.end ?? time.time;

    animated.animations.push();
    // where does the logic for "how to animate a unit moving" go?
    //
    // maybe in the command?
    const subPath = 5;
    for (let i = 0; i < path.length - 1; i++) {
      const start = toHexPosition(path[i]);
      const end = toHexPosition(path[i + 1]);
      const markers = [];
      for (let i = 1; i <= subPath; i++) {
        const p = vec3.create();
        vec3.scale(p, start, 1 - i / subPath);
        vec3.scaleAndAdd(p, p, end, i / subPath);
        const e = new Entity(new Transform(), new Mesh(pathMarker));
        p[1] = 0.5;
        e.components.transform.setPosition(p);
        markers.push([i / subPath, e]);
      }
      const animation = (t) => {
        markers.forEach((val) => {
          if (t >= val[0]) {
            val[1].deleteEntity();
            markers.remove(val);
          }
        });
        const start = toHexPosition(path[i]);
        const target = toHexPosition(path[i + 1]);
        const interpolate = vec3.create();
        vec3.scale(start, start, 1 - t);
        vec3.scale(target, target, t);
        vec3.add(interpolate, start, target);
        interpolate[1] = 0.25 + Math.abs(Math.sin(t * Math.PI * 2 * 3)) * 0.1;
        transform.setPosition(interpolate);
      };
      animated.animations.push(new Animation(endTime, endTime + 1, animation));
      endTime += 1;
    }

    e.components.coordinate.setPos(hexEntity.components.coordinate.pos);
  });
};

const getCollision = (state) => {
  const [worldPos, worldDir] = getWorldRayFromCamera(
    cameraEntity,
    state.mpos.val
  );

  return getRayCollision(worldPos, worldDir);
};
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

    // camera controls
    if (
      state.rmb?.val === 1 &&
      state.mpos?.prev?.val &&
      state.mpos?.frame === time.frame
    ) {
      this.commands.push({
        type: "movedMouse",
        val: { prev: state.mpos.prev.val, pos: state.mpos.val },
      });
    }
    if (state.wheel?.frame === time.frame) {
      const deltaY = state.wheel.val - state.wheel.prev.val;
      const { camera } = cameraEntity.components;
      camera.distance = Math.clamp(camera.distance + deltaY / 100, 1, 10);
    }
    if (state.lmb?.val === 1 && state.lmb?.frame === time.frame) {
      // move camera to hex
      const collision = getCollision(state);
      if (collision) {
        const [collider, _] = collision;
        const e = collider.getEntity();
        cameraEntity.components.camera.setTarget(
          e.components.transform.getWorldPosition()
        );
        if (e.components.hex) {
          spawnAroundHex(e);
        }
      }
    }

    this.currentState().handleInput(this);
  }
}

class OpenState extends State {
  handleInput(manager) {
    const { state } = input;

    // left click
    if (state.lmb?.val === 1 && state.lmb?.frame === time.frame) {
      // check if there's a unit in the hex
      const collision = getCollision(state);
      if (collision) {
        const [collider, _] = collision;
        const e = collider.getEntity();
        manager.replaceState(new SelectedState(e));
      }
    }
  }
}

// if you select an option, then its hex, it should build that option?
// initial choice should be a "buildsite" that upgrades into something that
// produces stuff.
// but can directly build for now.

// TODO: Implement "upgrade" component

class SelectedState extends State {
  constructor(entity) {
    super();
    this.entity = entity;
  }

  init() {
    this.entity.addComponent(new Selected());
    markerEntity.components.mesh.setVisible(true);
  }

  cleanup() {
    this.entity.removeComponent(this.entity.components.selected);
    markerEntity.components.mesh.setVisible(false);
  }

  handleInput(manager) {
    const { state } = input;

    // left click
    var unselected = false;
    if (state.lmb?.val === 1 && state.lmb?.frame === time.frame) {
      // check if there's a unit in the hex
      const collision = getCollision(state);
      if (collision) {
        const [collider, _] = collision;
        const e = collider.getEntity();
        if (this.entity === e) {
          unselected = true;
          manager.replaceState(new OpenState());
        } else {
          manager.replaceState(new SelectedState(e));
        }
      }
    }
    if (state.rmb?.val === 1 && state.rmb?.frame === time.frame) {
      const collision = getCollision(state);

      // check if there's a unit in the hex
      if (collision && !unselected) {
        const [collider, _] = collision;
        const e = collider.getEntity();

        // check if the currently selected thing is a option
        // check if the right clicked thing is the target
        if (this.entity.components.option?.target === e) {
          manager.replaceState(new OpenState());
          spawnBuilding(e, this.entity.components.option.result);
        }

        // check if the currently selecting thing is an output
        // and the target is an input
        if (this.entity.components.output && e.components.input) {
          connectResource(this.entity.components.output, e.components.input);
        }
      }

      // check
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
      case "clicked":
        {
          const val = action.val;

          const [worldPos, worldDir] = getWorldRayFromCamera(cameraEntity, val);

          const collision = getRayCollision(worldPos, worldDir);
          if (collision) {
            const [collider, _] = collision;
            const e = collider.getEntity();
            cameraEntity.components.camera.setTarget(
              e.components.transform.getWorldPosition()
            );
            if (e.components.hex) {
              spawnAroundHex(e);
            }

            moveTo(e);
          }
        }
        break;
      case "movedMouse":
        {
          const { camera } = cameraEntity.components;
          const { pos, prev } = action.val;
          const delta = vec2.clone(pos);
          vec2.sub(delta, prev, delta);

          camera.xAngle += 32 * delta[0];
          camera.yAngle = Math.clamp(
            camera.yAngle - 8 * delta[1],
            Math.PI / 10,
            Math.PI / 2 - 0.1
          );

          const [worldPos, worldDir] = getWorldRayFromCamera(cameraEntity, pos);

          const collision = getRayCollision(worldPos, worldDir);
          if (collision) {
            targetTransform.setPosition(collision[1][0]);
          }
        }
        break;
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
