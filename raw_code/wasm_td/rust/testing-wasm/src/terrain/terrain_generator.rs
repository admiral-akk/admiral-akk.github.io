use crate::mesh::*;
use crate::terrain::poisson_disc_sampler::*;
use crate::types::*;
use js_sys::Float32Array;
use noise::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct TerrainGenerator {
    blocks: u32,
    noise: RidgedMulti<Simplex>,
    blue_noise: PoissonDiscSampler,
}

#[wasm_bindgen]
impl TerrainGenerator {
    #[wasm_bindgen(constructor)]
    pub fn new(blocks: Option<u32>, seed: Option<u32>) -> Self {
        let seed = match seed {
            Some(seed) => seed,
            None => 10022,
        };
        let noise = RidgedMulti::new(seed)
            .set_octaves(6)
            .set_frequency(0.04)
            .set_lacunarity(2.0)
            .set_persistence(2.0)
            .set_attenuation(2.0);
        let mut blue_noise = PoissonDiscSampler::new(20.0, 20.0, 12.4);
        blue_noise.init();
        Self {
            blocks: match blocks {
                Some(blocks) => blocks,
                None => 3,
            },
            noise,
            blue_noise,
        }
    }

    fn generate_vec(&self, x: f32, y: f32, x_offset: f32, y_offset: f32) -> Vec3 {
        let _height = self
            .noise
            .get([(x + x_offset) as f64, (y + y_offset) as f64]) as f32;

        Vec3::new(x, 0.0, y)
    }

    pub fn generate_tree_pos(&self, x: i32, y: i32) -> Float32Array {
        let array = Float32Array::new_with_length(self.blue_noise.samples.len() as u32 * 3);

        let x_offset = x as f32 * 20.;
        let y_offset = y as f32 * 20.;
        for i in 0..(self.blue_noise.samples.len() as u32) {
            let (x, y) = self.blue_noise.samples[i as usize];

            let v1 = self.generate_vec(x, y, x_offset, y_offset);
            array.set_index(3 * i, x);
            array.set_index(3 * i + 1, v1.y);
            array.set_index(3 * i + 2, y);
        }
        array
    }

    pub fn generate_mesh(&self, x: i32, y: i32) -> Float32Array {
        let mut floor = Mesh::new();
        let x_offset = x as f32 * 20.;
        let y_offset = y as f32 * 20.;
        let color = Color::new(0.5, 0.5, 0.);
        let blocks = self.blocks;
        for x_val in 0..blocks {
            let x1 = 20.0 * (x_val as f32) / (blocks as f32) - 10.0;
            let x2 = 20.0 * ((1 + x_val) as f32) / (blocks as f32) - 10.0;
            for y_val in 0..blocks {
                let y1 = 20.0 * (y_val as f32) / (blocks as f32) - 10.0;
                let y2 = 20.0 * ((1 + y_val) as f32) / (blocks as f32) - 10.0;

                let v1 = self.generate_vec(x2, y2, x_offset, y_offset);
                let v2 = self.generate_vec(x1, y2, x_offset, y_offset);
                let v3 = self.generate_vec(x2, y1, x_offset, y_offset);
                let v4 = self.generate_vec(x1, y1, x_offset, y_offset);

                let v21 = v2.clone().sub(&v1);
                let v31 = v3.clone().sub(&v1);

                let n1 = v21.clone().cross(&v31).normalize();

                let color1 = if n1.y > -0.5 {
                    Color::new(0.5, 0.5, 0.5)
                } else if v1.y + v2.y + v3.y > -4. {
                    Color::new(0.9, 0.9, 0.9)
                } else {
                    color.clone()
                };

                let p1 = Point::new(v1, n1, color1);
                let p2 = Point::new(v2, n1, color1);
                let p3 = Point::new(v3, n1, color1);

                let v24 = v2.clone().sub(&v4);
                let v34 = v3.clone().sub(&v4);

                let n2 = v34.clone().cross(&v24).normalize();

                let color2 = if n2.y > -0.5 {
                    Color::new(0.5, 0.5, 0.5)
                } else if v4.y + v2.y + v3.y > -4. {
                    Color::new(0.9, 0.9, 0.9)
                } else {
                    color.clone()
                };

                let p4 = Point::new(v4, n2, color2);
                let p5 = Point::new(v2, n2, color2);
                let p6 = Point::new(v3, n2, color2);

                floor.add(MeshTriangle::new([p2, p1, p3]));
                floor.add(MeshTriangle::new([p4, p5, p6]));
            }
        }

        floor.to_array()
    }
}
