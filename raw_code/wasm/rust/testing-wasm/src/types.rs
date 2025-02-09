use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Vec3 {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Line {
    pub dir: Vec3,
    pub start: Vec3,
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Plane {
    pub normal: Vec3,
    pub offset: f32,
}
