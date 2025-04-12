use js_sys::Float32Array;
use serde::Deserialize;
use wasm_bindgen::prelude::*;
extern crate console_error_panic_hook;

#[wasm_bindgen]
struct AudioGenerator {}

#[derive(Deserialize)]
enum WaveType {
    Sine,
}

#[derive(Deserialize)]
struct EnvelopeParams {
    // start
    s: Option<f32>,
    // attack: time to max
    a: f32,
    // decay: time to 0
    d: f32,
    // if true, linear. otherwise exponential
    l: Option<bool>,
}

#[derive(Deserialize)]
enum Node {
    Osc {
        // frequency
        f: f32,
        // type of wave
        t: Option<WaveType>,
        // scale
        s: Option<f32>,
        // offset, applied after scale
        o: Option<f32>,
    },
    Gain {
        // inputs
        i: Vec<usize>,
        // max gain
        g: Option<f32>,
        // envelope
        e: Option<EnvelopeParams>,
    },
}

impl Node {
    fn value_at(&self, nodes: &Vec<Node>, time: f32) -> f32 {
        match self {
            Node::Osc { f, t, s, o } => {
                let multiple = 2.0 * std::f32::consts::PI * f;
                let wave_type = t.as_ref().unwrap_or(&WaveType::Sine);
                let scale = s.unwrap_or(1.0);
                let offset = o.unwrap_or(0.0);

                let v = match wave_type {
                    WaveType::Sine => (time * multiple).sin(),
                };

                v * scale + offset
            }
            Node::Gain { i, g, e } => {
                let max = g.unwrap_or(1.0);
                let gain = max
                    * match e {
                        None => 1.0,
                        Some(EnvelopeParams { s, a, d, l }) => {
                            let start_time = s.unwrap_or(0.0);

                            let t = if time > *d {
                                return 0.;
                            } else if time > *a {
                                (d - time) / (d - a)
                            } else {
                                (time - start_time) / (a - start_time)
                            };

                            if l.unwrap_or(false) {
                                t
                            } else {
                                let x: f32 = 0.1;
                                let rescale = x.exp() / (1.0 - x.exp());

                                (-t * x).exp() * rescale - rescale
                            }
                        }
                    };
                let mut total = 0.0;
                for n in 0..i.len() {
                    total += nodes[n].value_at(nodes, time);
                }
                gain * total
            }
        }
    }
}

#[derive(Deserialize)]
struct AudioParams {
    sample_rate: f32,
    nodes: Vec<Node>,
    // for each channel, which node it takes as input.
    channel_inputs: Vec<usize>,
}

impl AudioParams {
    fn fill_channels(&self, left: Float32Array, right: Float32Array) {
        let frame_count = left.length();
        for i in 0..frame_count {
            let t = (i as f32) / (self.sample_rate as f32);
            left.set_index(
                i,
                self.nodes[self.channel_inputs[0]].value_at(&self.nodes, t),
            );
            right.set_index(
                i,
                self.nodes[self.channel_inputs[1]].value_at(&self.nodes, t),
            );
        }
    }
}

#[wasm_bindgen]
impl AudioGenerator {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        console_error_panic_hook::set_once();
        Self {}
    }

    pub fn generate(&self, params: JsValue, left: Float32Array, right: Float32Array) {
        let params: AudioParams = serde_wasm_bindgen::from_value(params).unwrap();

        params.fill_channels(left, right);
    }
}
