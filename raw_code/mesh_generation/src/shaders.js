export const vertexShaderSource = `#version 300 es
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

export const fragmentShaderSource = `#version 300 es
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

export const wireFrameVertex = `#version 300 es
#pragma vscode_glsllint_stage: vert

precision mediump float;

uniform mat4 uView;
uniform mat4 uProjection;

layout(location = 0) in vec3 aPosition;

void main() {
    gl_Position = uProjection * uView * vec4(aPosition,1.);
}`;

export const wireFrameFrag = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

layout(location=0) out vec4 fragColor; 
void main() {
  fragColor = vec4(1.,0.,1., 1.);
}`;

export const quadFragmentShaderSource = `#version 300 es
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
export const renderTextureSource = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

uniform sampler2D uTexture;

in vec2 vTexCoord;

out vec4 fragColor;

void main()
{
  fragColor = vec4(texture(uTexture, vTexCoord).rgb , 1.);
}`;
