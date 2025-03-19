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

#[derive(Clone, Copy, Debug, PartialEq)]
struct ModelPoint {
    pos: [f32; 3],
    uv: [f32; 2],
}

#[derive(Clone, Copy, Debug, PartialEq)]
struct ModelTriangle {
    points: [ModelPoint; 3],
    normal: [f32; 3],
}

#[derive(Clone, Debug, PartialEq)]
struct ModelMesh {
    triangles: Vec<ModelTriangle>,
}

pub trait Vector3: Sized + Clone {
    fn x(&self) -> f32;
    fn y(&self) -> f32;
    fn z(&self) -> f32;
    fn set_x(&mut self, val: f32);
    fn set_y(&mut self, val: f32);
    fn set_z(&mut self, val: f32);

    fn new(v: [f32; 3]) -> Self;

    fn length(&self) -> f32 {
        self.length_sq().sqrt()
    }

    fn scale(&mut self, scalar: f32) -> &mut Self {
        self.set_x(self.x() * scalar);
        self.set_y(self.y() * scalar);
        self.set_z(self.z() * scalar);
        self
    }

    fn normalize(&mut self) -> &mut Self {
        self.scale(1.0 / self.length())
    }

    fn length_sq(&self) -> f32 {
        (&self).dot(self)
    }

    fn add<T: Vector3>(&mut self, other: &T) -> &mut Self {
        self.set_x(self.x() + other.x());
        self.set_y(self.y() + other.y());
        self.set_z(self.z() + other.z());
        self
    }

    fn sub<T: Vector3>(&mut self, other: &T) -> &mut Self {
        self.set_x(self.x() - other.x());
        self.set_y(self.y() - other.y());
        self.set_z(self.z() - other.z());
        self
    }

    fn mul<T: Vector3>(&mut self, other: &T) -> &mut Self {
        self.set_x(self.x() * other.x());
        self.set_y(self.y() * other.y());
        self.set_z(self.z() * other.z());
        self
    }

    fn cross<T: Vector3>(&self, other: &T) -> Self {
        let x = self.y() * other.z() - self.z() * other.y();
        let y = self.z() * other.x() - self.x() * other.z();
        let z = self.x() * other.y() - self.y() * other.x();
        Self::new([x, y, z])
    }

    fn dot<T: Vector3>(&self, other: &T) -> f32 {
        self.x() * other.x() + self.y() * other.y() + self.z() * other.z()
    }
}
impl Vector3 for [f32; 3] {
    #[inline(always)]
    fn set_x(&mut self, val: f32) {
        self[0] = val;
    }

    #[inline(always)]
    fn set_y(&mut self, val: f32) {
        self[1] = val;
    }

    #[inline(always)]
    fn set_z(&mut self, val: f32) {
        self[2] = val;
    }

    #[inline(always)]
    fn x(&self) -> f32 {
        self[0]
    }

    #[inline(always)]
    fn y(&self) -> f32 {
        self[1]
    }

    #[inline(always)]
    fn z(&self) -> f32 {
        self[2]
    }

    #[inline(always)]
    fn new(v: [f32; 3]) -> Self {
        v
    }
}

impl ModelPoint {
    pub fn new(pos: [f32; 3], uv: [f32; 2]) -> Self {
        ModelPoint { pos, uv }
    }
}

trait Transformable {
    fn apply_transform(&self, transform: &ModelTransform) -> Self;
}

impl Transformable for ModelPoint {
    fn apply_transform(&self, transform: &ModelTransform) -> Self {
        let mut v1 = self.clone();

        if let Some(offset) = transform.uv_offset {
            v1.uv[0] += offset[0];
            v1.uv[1] += offset[1];
        }
        if let Some(scale) = transform.scale {
            v1.pos.mul(&scale);
        };
        if let Some(rotation) = &transform.rotation {};
        if let Some(translation) = transform.translation {
            v1.pos.add(&translation);
        };
        v1
    }
}

impl Transformable for ModelTriangle {
    fn apply_transform(&self, transform: &ModelTransform) -> Self {
        let points = [
            self.points[0].apply_transform(&transform),
            self.points[1].apply_transform(&transform),
            self.points[2].apply_transform(&transform),
        ];

        let v21 = *points[1].pos.clone().sub(&points[0].pos);
        let v31 = *points[2].pos.clone().sub(&points[0].pos);

        ModelTriangle {
            points,
            // this could be invalid if the triangle no longer exists.
            normal: *v31.cross(&v21).normalize(),
        }
    }
}
impl Transformable for ModelMesh {
    fn apply_transform(&self, transform: &ModelTransform) -> Self {
        ModelMesh {
            triangles: self
                .triangles
                .iter()
                .map(|tri| tri.apply_transform(&transform))
                .collect(),
        }
    }
}

impl ModelTriangle {
    pub fn new(points: [ModelPoint; 3]) -> Option<Self> {
        let v21 = *points[1].pos.clone().sub(&points[0].pos);
        let v31 = *points[2].pos.clone().sub(&points[0].pos);
        let mut cross = v31.cross(&v21);

        if cross.length_sq() > 0.0001 {
            Some(ModelTriangle {
                points,
                normal: *cross.normalize(),
            })
        } else {
            None
        }
    }
}

impl ModelMesh {
    pub fn new() -> ModelMesh {
        ModelMesh {
            triangles: Vec::new(),
        }
    }

    pub fn add_triangle(&mut self, points: [ModelPoint; 3]) {
        if let Some(triangle) = ModelTriangle::new(points) {
            self.triangles.push(triangle);
        }
    }

    pub fn to_mesh(&self) -> Mesh {
        let mut mesh = Mesh::new();

        for i in 0..self.triangles.len() {
            let [p1, p2, p3] = &self.triangles[i].points;
            let n = &self.triangles[i].normal;

            let c1 = Color::new(p1.uv[0], p1.uv[1], 0.0);
            let c2 = Color::new(p2.uv[0], p2.uv[1], 0.0);
            let c3 = Color::new(p3.uv[0], p3.uv[1], 0.0);

            let n1 = Vec3::new(n[0], n[1], n[2]);
            let p1 = Point::new(Vec3::new(p1.pos[0], p1.pos[1], p1.pos[2]), n1, c1);
            let p2 = Point::new(Vec3::new(p2.pos[0], p2.pos[1], p2.pos[2]), n1, c2);
            let p3 = Point::new(Vec3::new(p3.pos[0], p3.pos[1], p3.pos[2]), n1, c3);
            mesh.add(MeshTriangle::new([p1, p2, p3]));
        }

        mesh
    }
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
    //  Offsets the uvs by the set value
    pub uv_offset: Option<[f32; 2]>,
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
    // the base of the model, [x, z, uvX, uvY]
    base: Vec<[f32; 4]>,
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
        let mut new_mesh = ModelMesh::new();

        let mut curr: Vec<_> = self
            .base
            .iter()
            .map(|[x, z, uv_x, uv_y]| ModelPoint::new([*x, 0.0, *z], [*uv_x, *uv_y]))
            .collect();
        let mut next = curr.clone();
        if self.close_bot {
            for j in 1..(curr.len() - 1) {
                new_mesh.add_triangle([curr[0], curr[j], curr[j + 1]]);
            }
        }

        for i in 0..self.transforms.len() {
            next = next
                .iter()
                .map(|p| p.apply_transform(&self.transforms[i]))
                .collect();

            for j in 0..curr.len() {
                let v1 = curr[j];
                let v2 = curr[(j + 1) % curr.len()];
                let v3 = next[j];
                let v4 = next[(j + 1) % next.len()];
                new_mesh.add_triangle([v1, v3, v2]);
                new_mesh.add_triangle([v2, v3, v4]);
            }
            curr = next.clone();
        }

        if self.close_top {
            for j in 1..(curr.len() - 1) {
                new_mesh.add_triangle([curr[0], curr[j + 1], curr[j]]);
            }
        }

        new_mesh.to_mesh()
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
