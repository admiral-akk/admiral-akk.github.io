use crate::mesh::*;
use crate::types::*;
use js_sys::Float32Array;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

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

    fn lerp<T: Vector3>(&self, other: &T, v: f32) -> Self {
        let t = v.max(0.0).min(1.0);
        Self::new([
            self.x() * (1.0 - t) + other.x() * t,
            self.y() * (1.0 - t) + other.y() * t,
            self.z() * (1.0 - t) + other.z() * t,
        ])
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
        if let Some(_rotation) = &transform.rotation {};
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
    meshes: HashMap<String, ModelMesh>,
}

#[derive(Deserialize, Serialize)]
enum ModelRotationAxis {
    XAxis,
    YAxis,
    ZAxis,
}

#[derive(Deserialize, Serialize)]
pub struct ModelRotation {
    axis: ModelRotationAxis,
    angle: f32,
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
pub struct CompositeModelReference {
    name: String,
    transform: ModelTransform,
}

#[derive(Serialize, Deserialize)]
pub struct CompositeModelParams {
    // (model to compose, transformations to apply)
    pub references: Vec<CompositeModelReference>,
}

#[derive(Serialize, Deserialize)]
struct ExtrudeTransform {
    transform: ModelTransform,
    side_transforms: [Vec<ExtrudeTransform>; 4],
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

#[derive(Serialize, Deserialize)]
struct SkinTransform {
    // the base of the model, [x, z, uvX, uvY]
    transform: ModelTransform,
    // the base of the model, [x, z, uvX, uvY]
    skin_vertices: Vec<SkinTransform>,
}

#[derive(Serialize, Deserialize)]
struct SkinModelParams {
    // the base of the model, [x, z, uvX, uvY]
    base: Vec<[f32; 4]>,
    // the series of transforms to apply
    transform: SkinTransform,
}

#[derive(Serialize, Deserialize)]
enum ModelParams {
    CompositeModel(CompositeModelParams),
    // operates on quads.
    ExtrudeModel(ExtrudeModelParams),
}

trait GenerateModel {
    fn generate_model(&self, model_generator: &ModelGenerator) -> ModelMesh;
}

impl GenerateModel for CompositeModelParams {
    fn generate_model(&self, model_generator: &ModelGenerator) -> ModelMesh {
        let mut mesh = ModelMesh::new();

        for reference in self.references.iter() {
            let existing_mesh = model_generator.get_mesh_internal(&reference.name);
            for triangle in existing_mesh.triangles.iter() {
                mesh.add_triangle(triangle.apply_transform(&reference.transform).points)
            }
        }
        mesh
    }
}

impl GenerateModel for ExtrudeModelParams {
    fn generate_model(&self, _model_generator: &ModelGenerator) -> ModelMesh {
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

        new_mesh
    }
}

impl GenerateModel for ModelParams {
    fn generate_model(&self, model_generator: &ModelGenerator) -> ModelMesh {
        match self {
            ModelParams::CompositeModel(params) => params.generate_model(model_generator),
            ModelParams::ExtrudeModel(params) => params.generate_model(model_generator),
        }
    }
}

impl ModelGenerator {
    fn get_mesh_internal(&self, name: &str) -> &ModelMesh {
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
        self.get_mesh_internal(name).to_mesh().mesh_size()
    }

    // generates and stores the mesh, returning the expected size of the the mesh.
    pub fn generate_model(&mut self, name: &str, params: JsValue) -> usize {
        let params: ModelParams = serde_wasm_bindgen::from_value(params).unwrap();
        let mesh = params.generate_model(&self);
        self.meshes.insert(name.into(), mesh);
        self.mesh_size(name)
    }

    pub fn fill_array(&self, name: &str, array: &Float32Array) {
        self.get_mesh_internal(name)
            .to_mesh()
            .fill_array(array, None);
    }

    pub fn get_mesh(&self, name: &str) -> Float32Array {
        self.get_mesh_internal(name).to_mesh().to_array()
    }
}
