use crate::serialize::*;
use crate::types::*;
use js_sys::Float32Array;

pub struct Color {
    r: f32,
    g: f32,
    b: f32,
}

impl Color {
    pub fn new(r: f32, g: f32, b: f32) -> Color {
        Self { r, g, b }
    }
}
impl Serialize<3> for Color {
    fn get(&self, index: u32) -> f32 {
        match index {
            0 => self.r,
            1 => self.g,
            2 => self.b,
            _ => panic!(),
        }
    }
}

pub struct Point {
    pos: Vec3,
    normal: Vec3,
    color: Color,
}

impl Point {
    pub fn new(pos: Vec3, normal: Vec3, color: Color) -> Point {
        Self { pos, normal, color }
    }
}

const POINT_SIZE: u32 = 9;

impl Serialize<POINT_SIZE> for Point {
    fn get(&self, index: u32) -> f32 {
        match index {
            0..3 => self.pos.get(index),
            3..6 => self.normal.get(index % 3),
            6..9 => self.color.get(index % 3),
            _ => panic!(),
        }
    }
}

pub struct MeshTriangle {
    points: [Point; 3],
}

const TRIANGLE_SIZE: u32 = 3 * POINT_SIZE;

impl Serialize<TRIANGLE_SIZE> for MeshTriangle {
    fn get(&self, index: u32) -> f32 {
        self.points[(index / POINT_SIZE) as usize].get(index % POINT_SIZE)
    }
}

impl MeshTriangle {
    pub fn new(points: [Point; 3]) -> MeshTriangle {
        Self { points }
    }
}

pub struct Mesh {
    triangles: Vec<MeshTriangle>,
}

impl Mesh {
    pub fn new() -> Mesh {
        Self {
            triangles: Vec::new(),
        }
    }

    pub fn add(&mut self, triangle: MeshTriangle) {
        self.triangles.push(triangle)
    }

    pub fn to_array(&self) -> Float32Array {
        let len = self.triangles.len() as u32 * TRIANGLE_SIZE;

        let array = Float32Array::new_with_length(len);

        for i in 0..self.triangles.len() {
            self.triangles[i].insert(&array, (TRIANGLE_SIZE as usize * i) as u32)
        }

        array
    }
}
