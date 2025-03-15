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
uniform float uFar;
uniform float uNear;

layout(location=0) out vec4 fragColor; 
layout(location=1) out float depth; 

vec2 poissonDisk[4] = vec2[](
  vec2( -0.94201624, -0.39906216 ),
  vec2( 0.94558609, -0.76890725 ),
  vec2( -0.094184101, -0.92938870 ),
  vec2( 0.34495938, 0.29387760 )
);

void main() {

  float distFromZero = 0.;

  float lightNorm =  clamp(dot(sunDirection, vNormal),0.,1.);

  vec3 lightColor = ambientStrength * ambientColor + lightNorm * sunStrength * sunColor;

  vec4 shadowCoord = vShadowCoord / vShadowCoord.w ;
  float shadowDepth = texture(uShadowMapSampler,  shadowCoord.xy ).r;
  float expectedDepth = shadowCoord.z  ;

  float normLDot = clamp(dot(sunDirection, vNormal), 0.,1.);
  float bias = 0.01*tan(acos(normLDot)); // cosTheta is dot( n,l ), clamped between 0 and 1
  bias = clamp(bias, 0.,0.01);

  float shadowed = float(expectedDepth > shadowDepth + bias);


  float visibility = normLDot;
    for (int i=0;i<4;i++){
    if ( texture( uShadowMapSampler, shadowCoord.xy + poissonDisk[i]/2700.0 ).r  <  shadowCoord.z-bias ){
      visibility-=0.25;
    }
    }
    visibility = clamp(visibility, 0., 1.);


  if (shadowCoord.x < -0. || shadowCoord.x > 1. || shadowCoord.y < -0. || shadowCoord.y > 1.) {
    visibility = 0.;
  }

  fragColor = vec4(vColor * (1. - 0.5 * (1. - visibility)), 1.);

  fragColor *= vInstancedColor;
  

  //fragColor = vec4(vec3(normLDot ), 1.);

  depth = 1. - vTransPos.z / (uFar  - uNear);

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
uniform float uFar;
uniform float uNear;

in vec2 vTexCoord;

out vec4 fragColor;

float linearDepth(float depthSample)
{
  return (2.0 * uNear) / (uFar + uNear - depthSample * (uFar - uNear));
}
void main()
{
float depthTexVal = (1. - texture(uDepth, vTexCoord).x) ;
float depth = uNear + (1. - texture(uDepth, vTexCoord).x) * (uFar - uNear);
float nonLinearDepth = 1. / (depthTexVal * (1. / uFar + 1. / uNear) + 1. / uNear);
  fragColor =  vec4(depth, 0., 0., 1.);
  fragColor =  vec4(depth - 9., 0., 0., 1.);
  fragColor =  vec4(texture(uColor, vTexCoord).rgb, 1.);

//  fragColor = mix(fragColor, vec4(uBackgroundColor, 1.), pow(smoothstep(0.45, 1.,depthTexVal), 0.95));
  vec2 pointerPos = uPointerPos;
  pointerPos.x = clamp(pointerPos.x, 0.,1.);
  pointerPos.y = clamp(pointerPos.y, 0.,1.);
  if (length(vTexCoord - pointerPos) < 0.01) {
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
