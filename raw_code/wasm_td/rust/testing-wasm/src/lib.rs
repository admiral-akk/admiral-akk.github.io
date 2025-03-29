mod brush;
mod composition;
mod line;
mod mesh;
mod plane;
mod serialize;
mod types;
mod utils;
pub mod vec3;
pub mod util {
    pub mod vector3;
}
mod model {
    pub mod face;
    pub mod model_generator;
}
mod texture {
    pub mod texture_generator;
}
mod terrain {
    pub mod chunk;
    pub mod cube_gen;
    pub mod layer_proc_gen;
    pub mod poisson_disc_sampler;
    pub mod terrain_generator;
    pub mod tree_generator;
}

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, testing-wasm!");
}
