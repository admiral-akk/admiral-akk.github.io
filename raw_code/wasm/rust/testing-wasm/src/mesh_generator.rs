use crate::mesh::*;
use crate::types::*;
use js_sys::Float32Array;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct TerrainGenerator {
    seed: u32,
}

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

    pub fn generate_mesh(&self) -> Float32Array {
        let mut floor = Mesh::new();

        floor.add(MeshTriangle::new([
            Point::new(
                Vec3::new(10.0, 0.0, 10.0),
                Vec3::new(0.0, 0.0, 0.0),
                Color::new(0.5, 0.5, 0.5),
            ),
            Point::new(
                Vec3::new(10.0, 0.0, -10.0),
                Vec3::new(0.0, 0.0, 0.0),
                Color::new(0.5, 0.5, 0.5),
            ),
            Point::new(
                Vec3::new(-10.0, 0.0, 10.0),
                Vec3::new(0.0, 0.0, 0.0),
                Color::new(0.5, 0.5, 0.5),
            ),
        ]));

        floor.add(MeshTriangle::new([
            Point::new(
                Vec3::new(10.0, 0.0, -10.0),
                Vec3::new(0.0, 0.0, 0.0),
                Color::new(0.5, 0.5, 0.5),
            ),
            Point::new(
                Vec3::new(-10.0, 0.0, -10.0),
                Vec3::new(0.0, 0.0, 0.0),
                Color::new(0.5, 0.5, 0.5),
            ),
            Point::new(
                Vec3::new(-10.0, 0.0, 10.0),
                Vec3::new(0.0, 0.0, 0.0),
                Color::new(0.5, 0.5, 0.5),
            ),
        ]));

        floor.to_array()
    }
}
