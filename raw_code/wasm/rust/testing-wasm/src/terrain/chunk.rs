use crate::mesh::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct Chunk {
    pub x: u32,
    pub y: u32,
    terrain_mesh: Mesh,
}
