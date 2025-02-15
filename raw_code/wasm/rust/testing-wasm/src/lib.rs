mod brush;
mod composition;
mod line;
mod mesh_generator;
mod plane;
mod types;
mod utils;
mod vec3;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, testing-wasm!");
}
