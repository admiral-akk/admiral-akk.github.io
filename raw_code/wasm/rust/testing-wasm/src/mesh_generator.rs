use wasm_bindgen::prelude::*;

//
#[wasm_bindgen]
pub struct TerrainGenerator {
    seed: u32,
}

use js_sys::Float32Array;

#[wasm_bindgen]
impl TerrainGenerator {
    #[wasm_bindgen(constructor)]
    pub fn new(seed: Option<u32>) -> Self {
        Self {
            seed: match seed {
                Some(seed) => seed,
                None => 0,
            },
        }
    }

    fn generate_mesh(&self) -> Float32Array {
        // Allocate a Vec in Rust with some data
        let data = vec![
            10.0, 0.0, 10.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 10.0, 0.0, -10.0, 0.5, 0.5, 0.5, 0.5,
            0.5, 0.5, -10.0, 0.0, 10.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 10.0, 0.0, -10.0, 0.5, 0.5,
            0.5, 0.5, 0.5, 0.5, -10.0, 0.0, -10.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -10.0, 0.0, 10.0,
            0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
        ];

        let array = Float32Array::new_with_length(data.len() as u32);
        // Copy the Rust Vec data into the Float32Array
        array.copy_from(&data);

        // Return the Float32Array to JavaScript
        array
    }
}
