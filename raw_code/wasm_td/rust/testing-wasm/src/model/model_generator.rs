use crate::mesh::*;
use crate::types::*;
use js_sys::Float32Array;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

const PI: f32 = 3.14159265358979323846264338327950288_f32;

fn generateVec3(angle: f32, radius: f32, height: f32) -> Vec3 {
    Vec3::new(angle.cos() * radius, height, angle.sin() * radius)
}

#[wasm_bindgen]
pub struct ModelGenerator {
    meshes: HashMap<String, Mesh>,
}

#[derive(Deserialize, Serialize)]
enum ModelRotationAxis {
    X_AXIS,
    Y_AXIS,
    Z_AXIS,
}

#[derive(Deserialize, Serialize)]
pub struct ModelRotation {
    pub axis: ModelRotationAxis,
    pub angle: f32,
}

#[derive(Serialize, Deserialize)]
pub struct ModelTransform {
    // Scales the vertices along x, y, z.
    pub scale: Option<[f32; 3]>,
    // Rotates the mesh along the axes in order.
    pub rotation: Vec<ModelRotation>,
    // Offsets the vertices by the provided translation.
    pub translation: Option<[f32; 3]>,
}

#[derive(Serialize, Deserialize)]
pub struct CurveModelParams {
    // width, height respectively.
    pub curve: Vec<[f32; 2]>,
    // color to bake in
    pub color: [f32; 3],
    // number of points to rotate about the center.
    pub points: u32,
    // whether to close the top of the mesh
    pub close_top: bool,
    // whether to close the bottom of the mesh.
    pub close_bot: bool,
}

#[derive(Serialize, Deserialize)]
enum ModelParams {
    CurveModel(CurveModelParams),
}

#[wasm_bindgen]
impl ModelGenerator {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            meshes: HashMap::new(),
        }
    }

    fn get_mesh_internal(&self, name: &str) -> &Mesh {
        self.meshes.get(name.into()).unwrap()
    }

    pub fn mesh_size(&self, name: &str) -> usize {
        self.get_mesh_internal(name).mesh_size()
    }

    fn generate_curve_model(&self, params: CurveModelParams) -> Mesh {
        let mut triangles = Vec::new();

        let points = params.points;
        let curve = params.curve;

        for i in 1..(points - 1) {
            if params.close_bot {
                let [radius, height] = curve[0];
                let angle1 = PI / (points as f32);
                let angle2 = 2.0 * (i as f32 + 0.5) * PI / (points as f32);
                let angle3 = 2.0 * (i as f32 + 1.5) * PI / (points as f32);

                let v1_bot = generateVec3(angle1, radius, height);
                let v2_bot = generateVec3(angle2, radius, height);
                let v3_bot = generateVec3(angle3, radius, height);

                triangles.push([v1_bot, v2_bot, v3_bot]);
            }

            if params.close_top {
                let [radius, height] = curve[curve.len() - 1];
                let angle1 = PI / (points as f32);
                let angle2 = 2.0 * (i as f32 + 0.5) * PI / (points as f32);
                let angle3 = 2.0 * (i as f32 + 1.5) * PI / (points as f32);

                let v1_top = generateVec3(angle1, radius, height);
                let v2_top = generateVec3(angle2, radius, height);
                let v3_top = generateVec3(angle3, radius, height);
                triangles.push([v2_top, v1_top, v3_top]);
            }
        }

        // create strips
        for i in 0..(curve.len() - 1) {
            for j in 0..points {
                let [radius1, height1] = curve[i];
                let [radius2, height2] = curve[i + 1];
                let angle1 = 2.0 * (j as f32 + 0.5) * PI / (points as f32);
                let angle2 = 2.0 * (j as f32 + 1.5) * PI / (points as f32);

                let v1_bot = generateVec3(angle1, radius1, height1);
                let v2_bot = generateVec3(angle2, radius1, height1);
                let v1_top = generateVec3(angle1, radius2, height2);
                let v2_top = generateVec3(angle2, radius2, height2);

                triangles.push([v2_bot, v1_bot, v1_top]);
                triangles.push([v2_bot, v1_top, v2_top]);
            }
        }

        let mut mesh = Mesh::new();

        let color_val = Color::new(params.color[0], params.color[1], params.color[2]);

        for i in 0..triangles.len() {
            let [v1, v2, v3] = triangles[i];

            let v21 = v2.clone().sub(&v1);
            let v31 = v3.clone().sub(&v1);

            let n1 = v31.clone().cross(&v21).normalize();
            let p1 = Point::new(v1, n1, color_val);
            let p2 = Point::new(v2, n1, color_val);
            let p3 = Point::new(v3, n1, color_val);
            mesh.add(MeshTriangle::new([p1, p2, p3]));
        }

        mesh
    }

    // generates and stores the mesh, returning the expected size of the the mesh.
    pub fn generate_model(&mut self, name: &str, params: JsValue) -> usize {
        let params: ModelParams = serde_wasm_bindgen::from_value(params).unwrap();
        let mesh = match params {
            ModelParams::CurveModel(params) => self.generate_curve_model(params),
        };
        self.meshes.insert(name.into(), mesh);
        self.mesh_size(name)
    }

    pub fn fill_array(&self, name: &str, array: &Float32Array) {
        self.get_mesh_internal(name).fill_array(array, None);
    }

    pub fn get_mesh(&self, name: &str) -> Float32Array {
        self.get_mesh_internal(name).to_array()
    }
}
