use crate::mesh::*;
use crate::types::*;
use js_sys::Float32Array;
use wasm_bindgen::prelude::*;

const PI: f32 = 3.14159265358979323846264338327950288_f32;

fn generateVec3(angle: f32, dim: &Vec3, height: f32) -> Vec3 {
    Vec3::new(angle.cos() * dim.x, height, angle.sin() * dim.z)
}

#[wasm_bindgen]
pub struct CubeGenerator {}
#[wasm_bindgen]
impl CubeGenerator {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {}
    }

    pub fn generate_mesh(&self, dim: &mut Vec3, color: Vec3) -> Float32Array {
        let color_val = Color::new(color.x, color.y, color.z);
        dim.scale(0.5);

        let heights = [-dim.y, dim.y];

        let mut triangles = Vec::new();

        let points = 4;
        // create bottom / top
        for i in 1..(points - 1) {
            let angle1 = PI / (points as f32);
            let angle2 = 2.0 * (i as f32 + 0.5) * PI / (points as f32);
            let angle3 = 2.0 * (i as f32 + 1.5) * PI / (points as f32);

            let v1_bot = generateVec3(angle1, &dim, heights[0]);
            let v2_bot = generateVec3(angle2, &dim, heights[0]);
            let v3_bot = generateVec3(angle3, &dim, heights[0]);

            let v1_top = generateVec3(angle1, &dim, heights[1]);
            let v2_top = generateVec3(angle2, &dim, heights[1]);
            let v3_top = generateVec3(angle3, &dim, heights[1]);

            triangles.push([v1_bot, v2_bot, v3_bot]);
            triangles.push([v2_top, v1_top, v3_top]);
        }

        // create strips
        for i in 0..(heights.len() - 1) {
            for j in 0..points {
                let angle1 = 2.0 * (j as f32 + 0.5) * PI / (points as f32);
                let angle2 = 2.0 * (j as f32 + 1.5) * PI / (points as f32);

                let v1_bot = generateVec3(angle1, &dim, heights[i]);
                let v2_bot = generateVec3(angle2, &dim, heights[i]);
                let v1_top = generateVec3(angle1, &dim, heights[i + 1]);
                let v2_top = generateVec3(angle2, &dim, heights[i + 1]);

                triangles.push([v2_bot, v1_bot, v1_top]);
                triangles.push([v2_bot, v1_top, v2_top]);
            }
        }

        let mut cube = Mesh::new();

        for i in 0..triangles.len() {
            let [v1, v2, v3] = triangles[i];

            let v21 = v2.clone().sub(&v1);
            let v31 = v3.clone().sub(&v1);

            let n1 = v31.clone().cross(&v21).normalize();
            let p1 = Point::new(v1, n1, color_val);
            let p2 = Point::new(v2, n1, color_val);
            let p3 = Point::new(v3, n1, color_val);
            cube.add(MeshTriangle::new([p1, p2, p3]));
        }

        cube.to_array()
    }
}
