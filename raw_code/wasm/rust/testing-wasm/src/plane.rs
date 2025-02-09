
use wasm_bindgen::prelude::*;
use crate::vec3::Vec3;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug,  PartialEq)]
pub struct Plane {
    normal: Vec3,
    offset: f32,
}
