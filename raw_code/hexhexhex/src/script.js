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
import { instancedMeshes } from "./renderer/instancedMesh.js";
import { Renderer } from "./renderer/renderer.js";
import { Entity, getEntitiesWith } from "./ecs/entity.js";
import { Mesh } from "./components/render/mesh.js";
import { Hex } from "./components/game/hex.js";
import { Transform } from "./components/render/transform.js";
import { UpdateMeshTransform } from "./systems/render/updateMeshTransform.js";
import {
  AnimateMeshTransform,
  toHexPosition,
} from "./systems/render/animateMeshTransform.js";
import { MoveCamera } from "./systems/render/moveCamera.js";
import { BoxCollider, Collider } from "./components/collider.js";
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
import { Structure } from "./components/game/structure.js";
import { Producer } from "./components/game/producer.js";
import { Resource } from "./components/game/resource.js";
import { PositionResources } from "./systems/render/positionResources.js";
import { Component } from "./ecs/component.js";
import { Clickable } from "./components/client/clickable.js";
import { Coordinate } from "./components/game/coordinate.js";
import { Option } from "./components/game/option.js";
import { Input } from "./components/game/input.js";
import { Output } from "./components/game/output.js";
import { Upgrade } from "./components/game/upgrade.js";
import { UpgradePositions } from "./systems/render/upgradePositions.js";
import { buildings } from "./building.js";
import { UpgradeBuildings } from "./systems/render/upgradeBuildings.js";

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

const treeVertexShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: vert

precision mediump float;

uniform mat4 uView;
uniform mat4 uProjection;
uniform mat4 uShadowVP;
uniform float uTime;
uniform sampler2D uSmoothNoiseSampler;

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
    

    // move the sample over time
    vec2 noiseSampleUV = vPos.xz / 5. + uTime / 100.;

    // offset the higher up values according to the noise texture
    float xNoise = 2. * (texture(uSmoothNoiseSampler,  noiseSampleUV ).r - 0.5);
    float zNoise = 2. * (texture(uSmoothNoiseSampler,  noiseSampleUV + 0.5).r - 0.5);

    vPos.x += xNoise * smoothstep(0.3,0.6, vPos.y) / 7. ;
    vPos.z += zNoise * smoothstep(0.2,0.4, vPos.y) / 7.;



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

  if (vInstancedMetadata.y == 1) {
    fragColor.r = 1.;
  }

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
const treeProgram = createProgram(
  gl,
  treeVertexShaderSource,
  fragmentShaderSource
);

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

const brown = "#5D4037";
const darkGreen = "#2E7D32";
const grey = "#CCCCCC";
const darkgrey = "#888888";
const white = "#EEEEEE";

const generateMountainVertices = () => {
  const vertices = [
    [0, 0.6, darkgrey],
    [0.05, 0.5, darkgrey],
    [0.15, 0.325, darkgrey],
    [0.35, 0.225, white],
    [0.6, 0.1, white],
    [0.8, 0, white],
  ];

  return vertices;
};

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
  const [finalHeight, scale, color] = vertices[vertices.length - 1];
  if (scale > 0) {
    vertices.push([finalHeight, 0, color]);
  }
  return vertices;
};

const treeMesh = generateSymmetricMesh(
  generateTreeVertices(),
  generateRegularPolygon(6, 1)
);

const generateRockVertices = () => {
  const vertices = [
    [0, 0.1, grey],
    [0.04, 0.1, grey],
    [0.08, 0.05, grey],
    [0.08, 0.0, grey],
  ];

  return vertices;
};

const mountainArr = generateSymmetricMesh(
  generateMountainVertices(),
  generateRegularPolygon(7, 1)
);

const rockMesh = generateSymmetricMesh(
  generateRockVertices(),
  generateRegularPolygon(5, 1)
);

const hexArr = generateSymmetricMesh(
  [
    [-0.25, 1, "#444444"],
    [0, 1, "#888800"],
    [0.25, 0.8, "#008800"],
    [0.25, 0, "#008800"],
  ],
  generateRegularPolygon(6, 1)
);

const generateUnitVertices = () => {
  const vertices = [];

  for (let i = 1; i < 10; i++) {
    const angle = ((Math.PI / 2) * i) / 10;
    vertices.push([i * 0.01, Math.sin(angle) * 0.1, darkgrey]);
  }
  for (let i = 1; i < 10; i++) {
    const angle = ((Math.PI / 2) * i) / 10;
    vertices.push([i * 0.01 + 0.4, Math.cos(angle) * 0.1, white]);
  }

  return vertices;
};

const units = generateSymmetricMesh(
  generateUnitVertices(),
  generateRegularPolygon(12, 1)
);
const optionSize = 0.1;

const farmOptionArr = generateSymmetricMesh(
  [
    [-optionSize, optionSize, [0.5, 0.7, 0]],
    [optionSize, optionSize, [0.5, 0.7, 0]],
    [optionSize, 0, [0.5, 0.7, 0]],
  ],
  generateRegularPolygon(4, 1)
);

const targetArr = generateSymmetricMesh(
  [
    [-0.25, 0.25, [1, 0, 0]],
    [0.25, 0.25, [1, 0, 0]],
    [0.25, 0, [1, 0, 0]],
  ],
  generateRegularPolygon(4, 1)
);

const selectedArr = generateSymmetricMesh(
  [
    [0, 0.8, [1, 1, 1]],
    [0, 0.7, [1, 1, 1]],
  ],
  generateRegularPolygon(6, 1)
);

const pathMarker = generateSymmetricMesh(
  [
    [-0.1, 0.1, white],
    [0.1, 0.1, white],
    [0.1, 0, white],
  ],
  generateRegularPolygon(4, 1)
);

var clickedIndex = -1;

// FBO
const catLoc = 1;

const cameraEntity = new Entity();

{
  cameraEntity.addComponent(new Camera(gl));
  const t = new Transform();
  t.setPosition([0, -4, 0]);
  cameraEntity.addComponent(t);
}

const spawnMountainOn = (hexEntity) => {
  const e = new Entity();
  e.addComponent(new Mesh(mountainArr));
  e.addComponent(new Transform({ parent: hexEntity.components.transform }));
  const pos = vec3.create();
  pos[0] += Math.random() * 0.15;
  pos[1] += 0.25;
  pos[2] += Math.random() * 0.15;
  e.components.transform.setScale([0.75, 0.75, 0.75]);
  e.components.transform.setPosition(pos);
};

const spawnRockOn = (hexEntity) => {
  const e = new Entity();
  e.addComponent(new Mesh(rockMesh));
  e.addComponent(new Transform({ parent: hexEntity.components.transform }));
  const pos = vec3.create();
  pos[0] += Math.random() - 0.5;
  pos[1] += 0.25;
  pos[2] += Math.random() - 0.5;
  e.components.transform.setPosition(pos);
};

const spawnTreeOn = (hexEntity) => {
  const e = new Entity();
  e.addComponent(new Mesh(treeMesh));
  e.addComponent(new Transform({ parent: hexEntity.components.transform }));
  const pos = vec3.create();
  pos[0] += (Math.random() - 0.5) * 0.5;
  pos[1] += 0.25;
  pos[2] += (Math.random() - 0.5) * 0.5;
  e.components.transform.setPosition(pos);
  e.components.transform.setScale([0.25, 0.25, 0.25]);
};

// add ability to select / de-select

const spawnHexAt = (coord) => {
  const hexExists = Coordinate.getEntities(coord).some(
    (e) => e.components.hex !== undefined
  );
  if (!hexExists) {
    const e = new Entity(
      new Mesh(hexArr),
      new Transform({ pos: toHexPosition(coord) }),
      new Hex(),
      new BoxCollider(),
      new Clickable(),
      new Coordinate(coord)
    );
    const farmBlueprint = buildings.farmBlueprint;
    for (let i = 0; i < 3; i++) {
      const o = new Entity(
        new BoxCollider([2 * optionSize, 2 * optionSize, 2 * optionSize]),
        new Clickable(),
        new Option(e, farmBlueprint),
        new Transform({
          parent: e.components.transform,
          pos: [0.4 * i - 0.4, 1, 0],
        })
      );
      const m = new Entity(
        new Mesh(farmBlueprint.option),
        new Transform({
          parent: o.components.transform,
        })
      );
      o.addComponent(new Structure(m));
    }
    return e;
    if (Math.random() < 0.4) {
      spawnMountainOn(e);
    } else {
      for (let i = 0; i < 5; i++) {
        spawnTreeOn(e);
      }
      for (let i = 0; i < 3; i++) {
        spawnRockOn(e);
      }
    }
    return e;
  }
  return null;
};
const spawnAroundHex = (entity) => {
  Position.adjacent(entity.components.coordinate.pos).forEach((p) =>
    spawnHexAt(p)
  );
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

const targetTransform = new Transform();
{
  const targetEntity = new Entity();
  targetEntity.addComponent(new Mesh(targetArr));
  targetTransform.setPosition([0, -50, 0]);
  targetEntity.addComponent(targetTransform);
}

const spawnUnitAt = (coords) => {
  new Entity(
    new Mesh(units),
    new Transform(),
    new Unit(),
    new Animated(),
    new Coordinate(coords)
  );
};

spawnBuilding(start, buildings.village);

const markerEntity = new Entity(new Mesh(selectedArr), new Transform());
{
  markerEntity.components.transform.setPosition([0, 0.4, 0]);
  markerEntity.components.mesh.setVisible(false);
}

const systems = [
  new MoveCamera(),
  new PositionResources(),
  new MarkSelected(markerEntity),
  new UpgradePositions(),
  new UpgradeBuildings(),
  new AnimateMeshTransform(),
  new ApplyAnimations(),
  new UpdateMeshTransform(),
];

const updateHexFrustumBounds = () => {
  const [frustum, corners] = calculateFrustumPlanes(cameraEntity);
  // add in any hexes that could be visible

  // 1. Slice frustum with the hex plane
  // project the corners into the y = 0 plane

  // take all of the line segments, and see which intersect the y = 0 plane

  const intersectionPoint = ([start, end]) => {
    if (start[1] === 0) {
      return vec3.clone(start);
    }

    if (end[1] === 0) {
      return vec3.clone(end);
    }

    if (Math.sign(start[1]) === Math.sign(end[1])) {
      return null;
    }

    const diff = vec3.create();
    vec3.sub(diff, start, end);
    vec3.scaleAndAdd(diff, start, diff, -start[1] / diff[1]);
    return diff;
  };

  const planeToLine = ([planePoint, planeNormal]) => {
    // get the line vector
    const lineV = vec3.create();
    const lineP = vec3.create();
    vec3.cross(lineV, planeNormal, [0, 1, 0]);
    vec3.normalize(lineV, lineV);

    if (planePoint[1] === 0) {
      vec3.copy(lineP, planePoint);
    } else {
      // get the "down" vector parallel to the plane

      const downV = vec3.create();
      vec3.cross(downV, lineV, planeNormal);
      vec3.normalize(downV, downV);

      // if the down vector moves the point away from y = 0, then invert it
      if (downV[1] * planePoint[1] > 0) {
        vec3.scale(downV, downV, -1);
      }

      // finally move the point to the y = 0 plane

      vec3.scaleAndAdd(
        lineP,
        planePoint,
        downV,
        Math.abs(planePoint[1] / downV[1])
      );
    }
    return [lineP, lineV];
  };

  const front = frustum[2];
  const back = frustum[3];
  const left = frustum[4];
  const right = frustum[5];

  // get corners by finding the closest points of lines
  const closestPoint = ([p1, v1], [p2, v2]) => {
    const p12 = vec2.clone([p1[0] - p2[0], p1[2] - p2[2]]);
    const v12 = vec2.clone([v1[0] - v2[0], v1[2] - v2[2]]);

    const t = -vec2.dot(v12, p12) / vec2.dot(v12, v12);
    const v = vec3.create();
    vec3.scaleAndAdd(v, p1, v1, t);
    return v;
  };

  const frontLine = planeToLine(front);
  const backLine = planeToLine(back);
  const leftLine = planeToLine(left);
  const rightLine = planeToLine(right);

  const cornerPoints = [
    closestPoint(frontLine, leftLine),
    closestPoint(frontLine, rightLine),
    closestPoint(backLine, leftLine),
    closestPoint(backLine, rightLine),
  ];

  // get max and min

  var minX = 10000000;
  var minZ = 10000000;
  var maxX = -10000000;
  var maxZ = -10000000;

  const points = [];
  for (let x = 0; x < 2; x++) {
    for (let y = 0; y < 2; y++) {
      const i1 = intersectionPoint([corners[x][y][0], corners[x][y][1]]);
      const i2 = intersectionPoint([corners[x][0][y], corners[x][1][y]]);
      const i3 = intersectionPoint([corners[0][y][x], corners[1][y][x]]);
      if (i1) {
        points.push(i1);
      }
      if (i2) {
        points.push(i2);
      }
      if (i3) {
        points.push(i3);
      }
    }
  }

  for (let i = 0; i < points.length; i++) {
    const p = points[i];

    minX = Math.min(p[0], minX);
    maxX = Math.max(p[0], maxX);

    minZ = Math.min(p[2], minZ);
    maxZ = Math.max(p[2], maxZ);
  }

  //
  // 2. map the corners of the hex plane to hex values

  minX = Math.floor(minX);
  maxX = Math.ceil(maxX);

  minZ = Math.floor(minZ - 1);
  maxZ = Math.ceil(maxZ + 1);

  for (let x = minX; x <= maxX; x++) {
    for (let y = minZ; y <= maxZ; y++) {
      spawnHexAt([x, y]);
    }
  }

  // now, delete any hexes that are no longer visible.

  instancedMeshes.forEach((meshes) => {
    meshes.updateFrustum(gl, frustum);
    meshes.cullInvisible(gl);
  });
};

const calculateNormal = ([v1, v2, v3]) => {
  const v12 = vec3.create();
  const v13 = vec3.create();

  vec3.sub(v12, v2, v1);
  vec3.sub(v13, v3, v1);
  vec3.cross(v12, v12, v13);
  vec3.normalize(v12, v12);
  return v12;
};

const calculatePlane = (tri) => {
  return [vec3.clone(tri[0]), calculateNormal(tri)];
};

var debugVertices = [];

const calculateFrustumPlanes = (cameraEntity) => {
  const { camera } = cameraEntity.components;

  var projection = mat4.create();
  var view = mat4.create();
  var temp = vec3.create();
  vec3.add(temp, camera.origin, camera.getOffset());

  mat4.lookAt(view, temp, camera.origin, [0, 1, 0]);

  const near = 0.1;
  const far = 20;
  mat4.perspective(
    projection,
    Math.PI / 3,
    gl.canvas.width / gl.canvas.height,
    near,
    far
  );

  mat4.invert(view, view);
  mat4.invert(projection, projection);
  var corners = [];
  for (let x = 0; x < 2; x++) {
    corners.push([]);

    for (let y = 0; y < 2; y++) {
      corners[x].push([]);

      for (let z = 0; z < 2; z++) {
        const w = z == 0 ? near : far;
        const clip = vec4.clone([
          (x === 0 ? -1 : 1) * w,
          (y === 0 ? -1 : 1) * w,
          (z === 0 ? -1 : 1) * w,
          w,
        ]);
        vec4.transformMat4(clip, clip, projection);
        vec4.transformMat4(clip, clip, view);
        corners[x][y].push(vec3.clone(clip));
      }
    }
  }

  // planes are a point + a normal
  const planes = [
    // top
    calculatePlane([corners[0][1][0], corners[1][1][0], corners[0][1][1]]),
    // bottom
    calculatePlane([corners[0][0][0], corners[0][0][1], corners[1][0][0]]),
    // back
    calculatePlane([corners[1][0][0], corners[1][1][0], corners[0][0][0]]),
    // front
    calculatePlane([corners[0][0][1], corners[0][1][1], corners[1][0][1]]),
    // left
    calculatePlane([corners[0][0][0], corners[0][1][0], corners[0][0][1]]),
    // right
    calculatePlane([corners[1][0][1], corners[1][1][1], corners[1][0][0]]),
  ];
  debugVertices = [];

  for (let x = 0; x < 2; x++) {
    for (let y = 0; y < 2; y++) {
      vec3.pushAll(corners[x][y][0], debugVertices);
      vec3.pushAll(corners[x][y][1], debugVertices);
      vec3.pushAll(corners[0][y][x], debugVertices);
      vec3.pushAll(corners[1][y][x], debugVertices);
      vec3.pushAll(corners[x][0][y], debugVertices);
      vec3.pushAll(corners[x][1][y], debugVertices);
    }
  }

  return [planes, corners];
};

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
    console.log(this);
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
          spawnBuilding(e, buildings.farmBlueprint);
        }

        // check if the currently selecting thing is an output
        // and the target is an input
        if (this.entity.components.output && e.components.input) {
          this.entity.components.output.connect(e.components.input);
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
  renderer.render(program, setUniforms);

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
