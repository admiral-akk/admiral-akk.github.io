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
    pub rotation: Option<Vec<ModelRotation>>,
    // Offsets the vertices by the provided translation.
    pub translation: Option<[f32; 3]>,
}

#[derive(Serialize, Deserialize)]
pub struct CurveModelParams {
    // width, height respectively.
    pub curve: Vec<[f32; 2]>,
    // color to bake in, based on height
    pub color_curve: Vec<(f32, [f32; 3])>,
    // number of points to rotate about the center.
    pub points: u32,
    // whether to close the top of the mesh
    pub close_top: bool,
    // whether to close the bottom of the mesh.
    pub close_bot: bool,
}

#[derive(Serialize, Deserialize)]
pub struct CompositeModelReference {
    name: String,
    transform: ModelTransform,
}

#[derive(Serialize, Deserialize)]
pub struct CompositeModelParams {
    // (model to compose, transformations to apply)
    pub references: Vec<CompositeModelReference>,
}

// it's a bit of a graph structure, where whenever you extrude, you create N new square faces.
// each of those faces could also extrude.
//
// for now just assume none of the faces extrude.
#[derive(Serialize, Deserialize)]
struct ExtrudeModelParams {
    // the base of the model
    base: Vec<[f32; 2]>,
    // the series of transforms to apply
    transforms: Vec<ModelTransform>,
    // whether to close the top of the mesh
    pub close_top: bool,
    // whether to close the bottom of the mesh.
    pub close_bot: bool,
}

fn transform_normal(v: &Vec3, transform: &ModelTransform) -> Vec3 {
    let mut v1 = v.clone();

    v1 = match transform.scale {
        None => v1,
        Some(scale) => v1,
    };

    // translation doesn't affect the normal
    match &transform.rotation {
        None => v1,
        Some(rotations) => {
            for rotation in rotations.iter() {}
            v1
        }
    }
}

fn transform_vert(v: &Vec3, transform: &ModelTransform) -> Vec3 {
    let mut v1 = v.clone();

    v1 = match transform.scale {
        None => v1,
        Some(scale) => v1.mul(&Vec3::new(scale[0], scale[1], scale[2])),
    };

    v1 = match &transform.rotation {
        None => v1,
        Some(rotations) => {
            for rotation in rotations.iter() {}
            v1
        }
    };
    match transform.translation {
        None => v1,
        Some(translation) => v1.add(&Vec3::new(translation[0], translation[1], translation[2])),
    }
}

fn transform_point(p: &Point, transform: &ModelTransform) -> Point {
    Point::new(
        transform_vert(&p.pos, transform),
        transform_normal(&p.normal, &transform),
        p.color,
    )
}

fn transform_triangle(tri: &MeshTriangle, transform: &ModelTransform) -> MeshTriangle {
    let [p1, p2, p3] = tri.points;
    MeshTriangle::new([
        transform_point(&p1, transform),
        transform_point(&p2, transform),
        transform_point(&p3, transform),
    ])
}

#[derive(Serialize, Deserialize)]
enum ModelParams {
    CurveModel(CurveModelParams),
    CompositeModel(CompositeModelParams),
    // operates on quads.
    ExtrudeModel(ExtrudeModelParams),
}

fn sample_color_curve(color_curve: &Vec<(f32, [f32; 3])>, point: &Vec3) -> Color {
    // find the two adjacent indices.

    if color_curve.is_empty() {
        return Color::new(255.0 / 255.0, 105.0 / 255.0, 180.0 / 255.0);
    }

    match color_curve.len() {
        0 => Color::new(255.0 / 255.0, 105.0 / 255.0, 180.0 / 255.0),
        1 => {
            let (height, color) = color_curve[0];
            Color::new(color[0], color[1], color[2])
        }
        _ => {
            let mut idx = match color_curve
                .binary_search_by(|(k, _v)| k.partial_cmp(&point.y).unwrap().reverse())
            {
                Err(idx) => idx,
                Ok(idx) => idx,
            };

            if idx < 1 {
                idx = 1;
            }
            if idx > color_curve.len() - 1 {
                idx = color_curve.len() - 1;
            }

            let (height1, color1) = color_curve[idx - 1];
            let (height2, color2) = color_curve[idx];

            let weight = (point.y - height1) / (height2 - height1);

            Color::new(
                (1.0 - weight) * color1[0] + weight * color2[0],
                (1.0 - weight) * color1[1] + weight * color2[1],
                (1.0 - weight) * color1[2] + weight * color2[2],
            )
        }
    }
}

trait GenerateModel {
    fn generate_model(&self, model_generator: &ModelGenerator) -> Mesh;
}

impl GenerateModel for CompositeModelParams {
    fn generate_model(&self, model_generator: &ModelGenerator) -> Mesh {
        let mut mesh = Mesh::new();

        for reference in self.references.iter() {
            let existing_mesh = model_generator.get_mesh_internal(&reference.name);
            for triangle in existing_mesh.triangles.iter() {
                mesh.add(transform_triangle(&triangle, &reference.transform))
            }
        }
        mesh
    }
}

impl GenerateModel for ExtrudeModelParams {
    fn generate_model(&self, model_generator: &ModelGenerator) -> Mesh {
        let mut triangles = Vec::new();

        let mut curr: Vec<_> = self
            .base
            .iter()
            .map(|[x, z]| Vec3::new(*x, 0.0, *z))
            .collect();
        let mut next = curr.clone();

        if self.close_bot {
            for j in 1..(curr.len() - 1) {
                triangles.push([curr[0], curr[j], curr[j + 1]]);
            }
        }

        for i in 0..self.transforms.len() {
            for j in 0..next.len() {
                next[j] = transform_vert(&next[j], &self.transforms[i]);
            }

            for j in 0..curr.len() {
                let v1 = curr[j];
                let v2 = curr[(j + 1) % curr.len()];
                let v3 = next[j];
                let v4 = next[(j + 1) % next.len()];
                triangles.push([v1, v3, v2]);
                if v3.dist_sq(&v4) > 0.0001 {
                    triangles.push([v2, v3, v4]);
                }
            }
            //
            for j in 0..curr.len() {
                curr[j] = transform_vert(&curr[j], &self.transforms[i]);
            }
        }

        if self.close_top {
            for j in 1..(curr.len() - 1) {
                triangles.push([curr[0], curr[j + 1], curr[j]]);
            }
        }

        let mut mesh = Mesh::new();

        for i in 0..triangles.len() {
            let [v1, v2, v3] = triangles[i];

            let c1 = Color::new(0.5, 0.0, 0.5);
            let c2 = Color::new(0.5, 0.0, 0.5);
            let c3 = Color::new(0.5, 0.0, 0.5);

            let v21 = v2.clone().sub(&v1);
            let v31 = v3.clone().sub(&v1);

            let cross = v31.clone().cross(&v21);
            if cross.length() > 0.0001 {
                let n1 = v31.clone().cross(&v21).normalize();
                let p1 = Point::new(v1, n1, c1);
                let p2 = Point::new(v2, n1, c2);
                let p3 = Point::new(v3, n1, c3);
                mesh.add(MeshTriangle::new([p1, p2, p3]));
            }
        }

        mesh
    }
}

impl GenerateModel for CurveModelParams {
    fn generate_model(&self, model_generator: &ModelGenerator) -> Mesh {
        let mut triangles = Vec::new();

        let points = self.points;
        let curve = &self.curve;

        for i in 1..(points - 1) {
            if self.close_bot {
                let [radius, height] = curve[0];
                let angle1 = PI / (points as f32);
                let angle2 = 2.0 * (i as f32 + 0.5) * PI / (points as f32);
                let angle3 = 2.0 * (i as f32 + 1.5) * PI / (points as f32);

                let v1_bot = generateVec3(angle1, radius, height);
                let v2_bot = generateVec3(angle2, radius, height);
                let v3_bot = generateVec3(angle3, radius, height);

                triangles.push([v1_bot, v2_bot, v3_bot]);
            }

            if self.close_top {
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

        self.color_curve
            .clone()
            .sort_unstable_by(|(a, _v), (b, _y)| a.partial_cmp(b).unwrap().reverse());

        for i in 0..triangles.len() {
            let [v1, v2, v3] = triangles[i];

            let c1 = sample_color_curve(&self.color_curve, &v1);
            let c2 = sample_color_curve(&self.color_curve, &v2);
            let c3 = sample_color_curve(&self.color_curve, &v3);
            let v21 = v2.clone().sub(&v1);
            let v31 = v3.clone().sub(&v1);

            let n1 = v31.clone().cross(&v21).normalize();
            let p1 = Point::new(v1, n1, c1);
            let p2 = Point::new(v2, n1, c2);
            let p3 = Point::new(v3, n1, c3);
            mesh.add(MeshTriangle::new([p1, p2, p3]));
        }

        mesh
    }
}

impl GenerateModel for ModelParams {
    fn generate_model(&self, model_generator: &ModelGenerator) -> Mesh {
        match self {
            ModelParams::CurveModel(params) => params.generate_model(model_generator),
            ModelParams::CompositeModel(params) => params.generate_model(model_generator),
            ModelParams::ExtrudeModel(params) => params.generate_model(model_generator),
        }
    }
}

impl ModelGenerator {
    pub fn get_mesh_internal(&self, name: &str) -> &Mesh {
        self.meshes.get(name.into()).unwrap()
    }
}

#[wasm_bindgen]
impl ModelGenerator {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            meshes: HashMap::new(),
        }
    }

    pub fn mesh_size(&self, name: &str) -> usize {
        self.get_mesh_internal(name).mesh_size()
    }

    // generates and stores the mesh, returning the expected size of the the mesh.
    pub fn generate_model(&mut self, name: &str, params: JsValue) -> usize {
        let params: ModelParams = serde_wasm_bindgen::from_value(params).unwrap();
        let mesh = params.generate_model(&self);
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
