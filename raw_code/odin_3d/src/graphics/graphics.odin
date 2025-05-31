package graphics

import rl "vendor:raylib"

GraphicsState :: struct {
	meshes:    map[string]rl.Mesh,
	materials: map[string]rl.Material,
	textures:  map[string]rl.Texture2D,
	shaders:   map[string]rl.Shader,
}
