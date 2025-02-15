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

    pub fn generate_mesh(&self, x: i32, y: i32) -> Float32Array {
        let mut floor = Mesh::new();
        let normal = Vec3::new(0.0, 1.0, 0.0);
        let color = Color::new(((x as f32) + 10.0) / 20.0, ((y as f32) + 10.0) / 20.0, 0.0);

        floor.add(MeshTriangle::new([
            Point::new(Vec3::new(10.0, 0.0, 10.0), normal, color),
            Point::new(Vec3::new(10.0, 0.0, -10.0), normal, color),
            Point::new(Vec3::new(-10.0, 0.0, 10.0), normal, color),
        ]));

        floor.add(MeshTriangle::new([
            Point::new(Vec3::new(10.0, 0.0, -10.0), normal, color),
            Point::new(Vec3::new(-10.0, 0.0, -10.0), normal, color),
            Point::new(Vec3::new(-10.0, 0.0, 10.0), normal, color),
        ]));

        floor.to_array()
    }
}
