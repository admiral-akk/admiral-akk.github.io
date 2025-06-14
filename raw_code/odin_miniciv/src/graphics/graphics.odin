package graphics

import rl "vendor:raylib"


VERT_SHADER :: `#version 330                       
layout(location = 0)  in vec3 vertexPosition;            
layout(location = 1) in vec2 vertexTexCoord;    
layout(location = 2) in vec3 vertexNormal;         
layout(location = 3)  in vec4 vertexColor;         
layout(location = 4)  in vec4 vertexTangent;         
layout(location = 5) in vec2 vertexTexCoord2;     
uniform sampler2D sTex;         
uniform vec4 colDiffuse2;
out vec2 fragTexCoord;             
out vec4 fragColor;  

uniform mat4 mvp;                  
void main()                        
{                                  
    fragTexCoord = vertexTexCoord; 
    fragColor = colDiffuse2;   
    gl_Position = mvp*vec4(vertexPosition, 1.0); 
}                                  
	              `


FRAG_SHADER :: `#version 330       
in vec2 fragTexCoord;              
in vec4 fragColor;                 
out vec4 finalColor;               
uniform sampler2D texture0;        
uniform vec4 colDiffuse;           
void main()                        
{                                  
    vec4 texelColor = texture(texture0, fragTexCoord);   
    finalColor = fragColor;        
}                                  
	`


manager := GraphicsManager{}

GraphicsManager :: struct {
	meshes:    map[string]rl.Mesh,
	materials: map[string]rl.Material,
	textures:  map[string]rl.Texture2D,
	shaders:   map[string]rl.Shader,
}

restart :: proc(state: ^GraphicsManager) {
	material := rl.LoadMaterialDefault()
	state.shaders["base"] = rl.LoadShaderFromMemory(VERT_SHADER, FRAG_SHADER)
	material.shader = state.shaders["base"]
	state.materials["base"] = material

	image := rl.GenImageGradientLinear(128, 128, 0, {255, 0, 0, 255}, {0, 255, 0, 255})
	state.textures["base"] = rl.LoadTextureFromImage(image)
	rl.GenTextureMipmaps(&state.textures["base"])
	rl.SetShaderValueTexture(state.materials["base"].shader, 0, state.textures["base"]) // Set shader uniform value for texture (sampler2d)
	state.materials["base"].maps[0].texture = state.textures["base"]
	state.meshes["base"] = rl.GenMeshCube(1, 1, 1)
}

init :: proc() {
	restart(&manager)
}
