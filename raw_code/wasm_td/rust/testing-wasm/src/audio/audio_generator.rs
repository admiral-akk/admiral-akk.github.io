use crate::mesh::*;
use crate::model::face::*;
use crate::types::*;
use crate::util::vector3::Vector3;
use js_sys::Float32Array;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;
extern crate console_error_panic_hook;

#[wasm_bindgen]
struct AudioGenerator {}

#[derive(Serialize, Deserialize)]
struct SinParams {
    freq: f32,
    frameCount: u32,
    sampleRate: f32,
}

#[wasm_bindgen]
impl AudioGenerator {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        console_error_panic_hook::set_once();
        Self {}
    }
    // generates and stores the mesh, returning the expected size of the the mesh.
    pub fn generate_sin(&mut self, params: JsValue, left: Float32Array, right: Float32Array) {
        let params: SinParams = serde_wasm_bindgen::from_value(params).unwrap();

        let soundLength = params.frameCount as f32 / params.sampleRate;
        for i in 0..params.frameCount {
            let t = (i as f32) / (params.sampleRate as f32);
            let volume = (t / soundLength).min(1. - (t / soundLength));

            let wave = volume * (t * std::f32::consts::PI * params.freq).sin();
            left.set_index(i, wave);
            right.set_index(i, wave);
        }
    }
}
