const fragValueNoise = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

in vec2 vTexCoord;

out float fragColor;

// https://thebookofshaders.com/10/
float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}


void main()
{
  fragColor = random(vTexCoord);
}`;

export { fragValueNoise };
