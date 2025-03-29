use crate::mesh::*;
use crate::types::*;
use js_sys::Float32Array;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

pub struct Face<Metadata: Sized> {
    vertices: Vec<(usize, Metadata)>,
}

impl<Metadata> Face<Metadata> {
    pub fn new(
        vertices: Vec<([f32; 3], Metadata)>,
        vertex_cache: &mut Vec<(usize, Metadata)>,
    ) -> Self {
        let vertices = vertices
            .into_iter()
            .map(|(v, metadata)| {
                vertex_cache.push(v);
                (vertex_cache.len() - 1, metadata)
            })
            .collect();
        Face { vertices }
    }
}

pub struct FaceModel<Metadata: Sized> {
    vertices: Vec<([f32; 3], Metadata)>,
}
