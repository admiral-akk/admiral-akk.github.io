use crate::mesh::*;
use crate::types::*;
use js_sys::Float32Array;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct TreeGenerator {}

#[wasm_bindgen]
impl TreeGenerator {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {}
    }

    fn generateVec3(&self, height: f32, width: f32, index: u32, point_count: u32) -> Vec3 {
        let angle = 2.0 * std::f32::consts::PI * index as f32 / point_count as f32;
        Vec3::new(width * angle.sin(), height, width * angle.cos())
    }

    pub fn generate_mesh(&self) -> Float32Array {
        let point_count = 7;
        let brown = Color::new(137.0 / 255.0, 81.0 / 255.0, 41.0 / 255.0);
        let green = Color::new(0.0, 128.0 / 255.0, 0.0);
        let height_width = vec![
            (0.0, 0.07, brown.clone()),
            (0.15, 0.07, green.clone()),
            (0.15, 0.3, green.clone()),
            (0.35, 0.22, green.clone()),
            (0.35, 0.25, green.clone()),
            (0.55, 0.18, green.clone()),
            (0.55, 0.22, green.clone()),
            (0.75, 0.1, green.clone()),
            (0.75, 0.14, green.clone()),
            (1.0, 0.0, green.clone()),
        ];
        let mut tree = Mesh::new();

        for i in 0..(height_width.len() - 1) {
            let (h1, w1, color) = height_width[i];
            let (h2, w2, _) = height_width[i + 1];
            for a in 0..point_count {
                let v1 = self.generateVec3(h1, w1, a + 1, point_count);
                let v2 = self.generateVec3(h1, w1, a, point_count);
                let v3 = self.generateVec3(h2, w2, a + 1, point_count);
                let v4 = self.generateVec3(h2, w2, a, point_count);

                let v21 = v2.clone().sub(&v1);
                let v31 = v3.clone().sub(&v1);

                let n1 = v21.clone().cross(&v31).normalize();

                let p1 = Point::new(v1, n1, color);
                let p2 = Point::new(v2, n1, color);
                let p3 = Point::new(v3, n1, color);
                tree.add(MeshTriangle::new([p2, p1, p3]));

                if w2 > 0. {
                    let v24 = v2.clone().sub(&v4);
                    let v34 = v3.clone().sub(&v4);

                    let n2 = v34.clone().cross(&v24).normalize();

                    let p4 = Point::new(v4, n2, color);
                    let p5 = Point::new(v2, n2, color);
                    let p6 = Point::new(v3, n2, color);

                    tree.add(MeshTriangle::new([p4, p5, p6]));
                }
            }
        }

        tree.to_array()
    }
}
