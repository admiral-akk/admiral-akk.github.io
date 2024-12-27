import "./util/array.js";
import {
  DataManager,
  DefaultCompressor,
  DefaultPreprocessor,
} from "./util/compression.js";
import { WindowManager } from "./util/window.js";
import {
  generateRegularPolygon,
  generateSymmetricMesh,
} from "./renderer/mesh.js";
import { Camera } from "./components/camera.js";
import { createProgram, createPostProcessProgram } from "./renderer/program.js";
import { InstancedMesh } from "./renderer/instancedMesh.js";
import { Renderer } from "./renderer/renderer.js";
import { Entity } from "./ecs/entity.js";
import { Mesh } from "./components/mesh.js";
import { Hex } from "./components/hex.js";
import { Transform } from "./components/transform.js";
import { UpdateMeshTransform } from "./systems/UpdateMeshTransform.js";
import { AnimateMeshTransform } from "./systems/animateMeshTransform.js";
import { MoveCamera } from "./systems/moveCamera.js";
import { BoxCollider } from "./components/collider.js";
import { vec3, vec4, mat4 } from "gl-matrix";
import { NoiseTexture } from "./renderer/noiseTextures.js";
import { Sun } from "./renderer/sun.js";

const dataManager = new DataManager(
  new DefaultCompressor(),
  new DefaultPreprocessor()
);
const windowManager = new WindowManager(16 / 16);
const gl = windowManager.canvas.getContext("webgl2");
gl.getExtension("EXT_color_buffer_float");
gl.getExtension("OES_texture_float_linear");
gl.getExtension("WEBGL_depth_texture");
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
layout(location = 7) in ivec4 aInstancedMetadata;

out vec3 vColor;
out vec2 vUv;
out vec4 vPos;
out vec4 vTransPos;
flat out ivec4 vInstancedMetadata;
out vec3 vNormal;
out vec4 vShadowCoord;

void main() {
    vPos = aModel * vec4(aPosition,1.);

    gl_Position = uProjection * uView * vPos;
    vShadowCoord = (uShadowVP * vPos);
    vUv = aPosition.xz;
    vColor = aColor;
    vNormal = aNormal;
    vTransPos = gl_Position;
    vInstancedMetadata = aInstancedMetadata;
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
in vec2 vUv;
in vec4 vPos;
in vec4 vTransPos;
flat in ivec4 vInstancedMetadata;
in vec3 vNormal;
in vec4 vShadowCoord;

uniform sampler2D uSampler1;
uniform sampler2D uShadowMapSampler;
uniform ivec4 uClickedCoord;
uniform vec3 uLightDir;

layout(location=0) out vec4 fragColor; 
layout(location=1) out float depth; 

void main() {
  
  float noiseVal = texture(uSampler1, 0.9 * vPos.xz).r;
  float dist = smoothstep(0.3,0.35,length(vUv) -  0.4 * noiseVal);

  float distFromZero = 0.;

  float lightNorm =  clamp(dot(sunDirection, vNormal),0.,1.);

  vec3 lightColor = ambientStrength * ambientColor + lightNorm * sunStrength * sunColor;

  fragColor = vec4(vColor, 1.);
  vec4 shadowCoord = vShadowCoord / vShadowCoord.w ;
  float shadowDepth = texture(uShadowMapSampler,  shadowCoord.xy ).r;
  float expectedDepth = shadowCoord.z  ;

  float val = 1000.*(expectedDepth - shadowDepth);

  fragColor = vec4(vec3( val), 1.);

  float bias = 0.001;
  float shadowed = float(expectedDepth > shadowDepth + bias);

  float normLDot = dot(sunDirection, vNormal);

  if (normLDot < 0.01) {
    shadowed = 1.;
  }

  if (shadowCoord.x < -0. || shadowCoord.x > 1. || shadowCoord.y < -0. || shadowCoord.y > 1.) {
    shadowed = 0.;
  }

  fragColor = vec4(vColor * (1. - 0.5 * shadowed), 1.);

  //fragColor = vec4(vec3(normLDot ), 1.);

  float far = 10.0; //far plane
  float near =  0.01; //near plane
  depth = 1. - vTransPos.z / (far  - near);

}`;

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
const quadFragmentShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

uniform sampler2D uDepth;
uniform sampler2D uColor;
uniform vec3 uBackgroundColor;

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

const brown = "#5D4037";
const darkGreen = "#2E7D32";

const generateTreeVertices = () => {
  var currHeight = 0.55;
  var currScale = 0.6;
  const vertices = [
    [0, 0.1, brown],
    [0.6, 0.1, darkGreen],
    [0.58, 0.2, darkGreen],
    [currHeight, currScale, darkGreen],
  ];

  const heightStep = 0.45;
  const scaleStep = 0.1;
  const scaleInnerDelta = 0.15;
  const heightInnerDelta = 0.3;
  for (let i = 0; i < 10; i++) {
    currHeight += heightStep;
    currScale -= scaleStep;
    let tempScale = Math.max(0, currScale - scaleInnerDelta);
    vertices.push([currHeight + heightInnerDelta, tempScale, darkGreen]);
    if (tempScale <= 0) {
      break;
    }
    vertices.push([currHeight, currScale, darkGreen]);
  }
  return vertices;
};

const treeMesh = new InstancedMesh(
  gl,
  generateSymmetricMesh(generateTreeVertices(), generateRegularPolygon(6, 1)),
  program,
  1000
);

const instancedMesh = new InstancedMesh(
  gl,
  generateSymmetricMesh(
    [
      [-0.25, 1, "#444444"],
      [0, 1, "#888800"],
      [0.25, 0.8, "#008800"],
    ],
    generateRegularPolygon(6, 1)
  ),
  program,
  1000
);

const target = new InstancedMesh(
  gl,
  generateSymmetricMesh(
    [
      [-0.25, 0.25, [1, 0, 0]],
      [0.25, 0.25, [1, 0, 0]],
    ],
    generateRegularPolygon(4, 1)
  ),
  program,
  1
);

var clickedIndex = -1;

// FBO
const catLoc = 1;

const entities = [];

const cameraEntity = new Entity();

{
  cameraEntity.addComponent(new Camera(gl));
  const t = new Transform();
  t.setPosition([0, -4, 0]);
  cameraEntity.addComponent(t);
  entities.push(cameraEntity);
}

const sqrt32 = Math.sqrt(3) / 2;

const getHexPosition = (coords) => {
  const [x, y] = coords;

  const xOffset = 1.5 * (x + 1 / 2) - 1.5 / 2;
  const yOffset = 2 * sqrt32 * (y + 1 / 2 + (x % 2 === 0 ? 0.5 : 0) - 1);

  return [xOffset, 0, yOffset];
};

const spawnTreeOn = (hexEntity) => {
  const e = new Entity();
  e.addComponent(new Mesh(gl, treeMesh));
  e.addComponent(new Transform(hexEntity.components.transform));
  const pos = vec3.create();
  pos[0] += (Math.random() - 0.5) * 0.5;
  pos[1] += 0.25;
  pos[2] += (Math.random() - 0.5) * 0.5;
  e.components.transform.setPosition(pos);
  e.components.transform.setScale([0.25, 0.25, 0.25]);
  entities.push(e);
};

const spawnHexAt = (coord) => {
  if (Hex.get(coord) === undefined) {
    const e = new Entity();
    e.addComponent(new Mesh(gl, instancedMesh));
    e.addComponent(new Transform());
    e.components.transform.setPosition(getHexPosition(coord));
    e.addComponent(new Hex(coord));
    e.addComponent(new BoxCollider());
    entities.push(e);
    for (let i = 0; i < 5; i++) {
      spawnTreeOn(e);
    }
    return e;
  }
  return null;
};

const spawnAroundHex = (entity) => {
  const center = entity.components.hex.coords;
  const offset = center[0] % 2 === 0 ? 0 : -1;
  spawnHexAt([center[0], center[1] + 1]);
  spawnHexAt([center[0], center[1] - 1]);
  spawnHexAt([center[0] + 1, center[1] + offset]);
  spawnHexAt([center[0] + 1, center[1] + offset + 1]);
  spawnHexAt([center[0] - 1, center[1] + offset]);
  spawnHexAt([center[0] - 1, center[1] + offset + 1]);
};

// to spawn around 0,0, we need
//

const start = spawnHexAt([0, 0]);

for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    spawnHexAt([x, y]);
  }
}
cameraEntity.components.camera.origin = vec3.clone(
  start.components.transform.pos
);
cameraEntity.components.camera.target = vec3.clone(
  start.components.transform.pos
);

//spawnAroundHex(start);

const targetTransform = new Transform();
{
  const targetEntity = new Entity();
  targetEntity.addComponent(new Mesh(gl, target));
  targetTransform.setPosition([0, -50, 0]);
  targetEntity.addComponent(targetTransform);
  entities.push(targetEntity);
}

const systems = [
  new MoveCamera(),
  new AnimateMeshTransform(),
  new UpdateMeshTransform(),
];

document.addEventListener("click", handleClick);
document.addEventListener("mousemove", handleMove);
document.addEventListener("wheel", (event) => {
  const { camera } = cameraEntity.components;
  camera.distance = Math.clamp(camera.distance + event.deltaY / 100, 1, 10);
});
document.addEventListener("contextmenu", (ev) => {
  ev.preventDefault();
  ev.stopPropagation();
  return false;
});

const actions = [];
function handleClick(event) {
  const { horizontalOffset, verticalOffset } = windowManager.sizes;
  if (event.target.id === "webgl") {
    const x = (event.clientX - horizontalOffset) / gl.canvas.width;
    const y = (event.clientY - verticalOffset) / gl.canvas.height;
    actions.push({ type: "clicked", val: [x, y] });
  }
}

var lastMousePos = null;

function handleMove(event) {
  const { horizontalOffset, verticalOffset } = windowManager.sizes;
  if (event.target.id === "webgl") {
    const deltaX = (event.clientX - horizontalOffset) / gl.canvas.width;
    const deltaY = (event.clientY - verticalOffset) / gl.canvas.width;

    if (event.buttons & 2) {
      // holding down right, move camera
      if (lastMousePos) {
        const [lastX, lastY] = lastMousePos;
        const { camera } = cameraEntity.components;
        camera.xAngle += 4 * (deltaX - lastX);
        camera.yAngle = Math.clamp(
          camera.yAngle + deltaY - lastY,
          Math.PI / 10,
          Math.PI / 2 - 0.1
        );
      }
      lastMousePos = [deltaX, deltaY];
    } else {
      lastMousePos = null;
    }
    const x = (event.clientX - horizontalOffset) / gl.canvas.width;
    const y = (event.clientY - verticalOffset) / gl.canvas.height;
    actions.push({ type: "movedMouse", val: [x, y] });
  } else {
    lastMousePos = null;
  }
}

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
  for (let i = 0; i < entities.length; i++) {
    const { collider, transform } = entities[i].components;
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
  }
  return best;
};

const applyActions = () => {
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
              e.components.transform.pos
            );
            spawnAroundHex(e);
          }
        }
        break;
      case "movedMouse":
        {
          const val = action.val;

          const [worldPos, worldDir] = getWorldRayFromCamera(cameraEntity, val);

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
    const system = systems[systemIndex];
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      if (system.canApply(entity)) {
        systems[systemIndex].apply(entity.components);
      }
    }
  }
};

const step = () => {
  // handle user input
  applyActions();

  // step through system
  applySystems();
};

const renderer = new Renderer(gl);
const noise = new NoiseTexture(gl);
const sunShadowMap = new Sun(gl);

noise.generateSmoothValueNoise(renderer, [256, 256]);
noise.generateValueNoise(renderer, [256, 256]);

const draw = () => {
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
    gl.activeTexture(gl.TEXTURE0 + shadowLoc);
    gl.bindTexture(gl.TEXTURE_2D, sunShadowMap.depthTexture);
    gl.uniform1i(
      gl.getUniformLocation(program, "uShadowMapSampler"),
      shadowLoc
    );
    // TODO: good abstraction around uniforms
    //
    // need to handle ints vs floats vs matrices vs textures cleanly.
    gl.activeTexture(gl.TEXTURE0 + catLoc);
    gl.bindTexture(gl.TEXTURE_2D, noise.valueNoiseTex);
    gl.bindTexture(gl.TEXTURE_2D, noise.smoothValueNoiseTex);
    gl.uniform1i(gl.getUniformLocation(program, "uSampler1"), catLoc);
    gl.uniform4iv(gl.getUniformLocation(program, "uClickedCoord"), [
      clickedIndex,
      0,
      0,
      0,
    ]);
    sunShadowMap.setUniform(program);
  };
  renderer.render(setUniforms);

  // Step 2: Draw the quad and pick a texture to render
  gl.useProgram(quadProgram);

  // TODO: good abstraction around uniforms
  //
  // need to handle ints vs floats vs matrices vs textures cleanly.
  gl.uniform3fv(
    gl.getUniformLocation(quadProgram, "uBackgroundColor"),

    new Float32Array([123 / 255, 217 / 255, 246 / 255])
  );

  renderer.renderPostProcess(quadProgram);
  return;
  gl.useProgram(renderTexture);
  gl.activeTexture(gl.TEXTURE0 + 3);
  gl.bindTexture(gl.TEXTURE_2D, sunShadowMap.depthTexture);
  gl.uniform1i(gl.getUniformLocation(renderTexture, "uTexture"), 3);

  renderer.renderPostProcess(renderTexture);
};

draw();

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
