package graphics

import rl "vendor:raylib"

GraphicsState :: struct {
	meshes:    map[string]rl.Mesh,
	materials: map[string]rl.Material,
	textures:  map[string]rl.Texture2D,
	shaders:   map[string]rl.Shader,
}
restart :: proc(state: ^GraphicsState) {

	image := rl.GenImageGradientLinear(128, 128, 0, {255, 0, 0, 255}, {0, 255, 0, 255})
	state.textures["base"] = rl.LoadTextureFromImage(image)
	rl.GenTextureMipmaps(&state.textures["base"])
	rl.SetShaderValueTexture(state.materials["base"].shader, 0, state.textures["base"]) // Set shader uniform value for texture (sampler2d)
	state.materials["base"].maps[0].texture = state.textures["base"]
}

init :: proc() -> GraphicsState {
	state := GraphicsState{}
	restart(&state)
	return state
}
