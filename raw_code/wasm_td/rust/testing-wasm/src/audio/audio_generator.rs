use js_sys::Float32Array;
use serde::Deserialize;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;
extern crate console_error_panic_hook;
extern crate web_sys;

// A macro to provide `println!(..)`-style syntax for `console.log` logging.
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[derive(Eq, Hash, PartialEq, Deserialize)]
enum NoiseType {
    // Flat frequency spectrum when plotted as a linear
    White,
    // Linear in logarithmic scale; it has equal power in bands that are proportionally wide.
    Pink,
    // Noise with a power density which decreases 6.02 dB per octave (20 dB per decade) with increasing frequency (frequency density proportional to 1/f2) over a frequency range excluding zero
    Brown,
}

// stores a 1 second clip of noise.
struct NoiseBuffers {
    noise_buffers: HashMap<NoiseType, Vec<f32>>,
    samples: usize,
}

impl NoiseBuffers {
    fn new(samples: usize) -> Self {
        let mut noise_buffers = HashMap::new();

        let mut white_noise = Vec::with_capacity(samples);
        let mut brown_noise = Vec::with_capacity(samples);
        let mut pink_noise = Vec::with_capacity(samples);

        // brown noise
        let mut last_brown_output = 0.0;

        // pink noise
        let (mut b0, mut b1, mut b2, mut b3, mut b4, mut b5, mut b6) =
            (0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
        // https://noisehack.com/generate-noise-web-audio-api/
        for i in 0..samples {
            white_noise.push(2.0 * (getrandom::u32().unwrap() % 100000) as f32 / 100000.0 - 1.0);

            // brown_noise
            {
                // the brown noise might be correlated with the white noise
                //
                // if this becomes an issue, generate a fresh rand for white here.
                brown_noise.push((last_brown_output + 0.02 * white_noise[i]) / 1.02);
                last_brown_output = brown_noise[i];
                brown_noise[i] *= 3.5; // (roughly) compensate for gain
            }

            // pink_noise
            {
                // the pink noise might be correlated with the white noise
                //
                // if this becomes an issue, generate a fresh rand for white here.
                b0 = 0.99886 * b0 + white_noise[i] * 0.0555179;
                b1 = 0.99332 * b1 + white_noise[i] * 0.0750759;
                b2 = 0.969 * b2 + white_noise[i] * 0.153852;
                b3 = 0.8665 * b3 + white_noise[i] * 0.3104856;
                b4 = 0.55 * b4 + white_noise[i] * 0.5329522;
                b5 = -0.7616 * b5 - white_noise[i] * 0.016898;
                pink_noise.push(b0 + b1 + b2 + b3 + b4 + b5 + b6 + white_noise[i] * 0.5362);
                pink_noise[i] *= 0.11; // (roughly) compensate for gain
                b6 = white_noise[i] * 0.115926;
            }
        }

        noise_buffers.insert(NoiseType::White, white_noise);
        noise_buffers.insert(NoiseType::Pink, pink_noise);
        noise_buffers.insert(NoiseType::Brown, brown_noise);
        Self {
            noise_buffers,
            samples,
        }
    }

    fn value_at(&self, noise: &NoiseType, idx: usize) -> f32 {
        // might want to weight samples? or not, it's noise.
        let buffer = self.noise_buffers.get(noise).unwrap();
        buffer[idx % buffer.len()]
    }
}

#[wasm_bindgen]
struct AudioGenerator {
    // these two params can be used to figure out how large buffers have to be
    sample_frequency: usize,
    max_sample_length: usize,
    // stores pre-computed noise.
    noise_buffers: NoiseBuffers,
}

#[derive(Deserialize)]
enum WaveType {
    Sin,
    Tri,
    Saw,
    Sqr,
}

#[derive(Deserialize)]
struct EnvelopeParams {
    // attack: time to max
    a: f32,
    // decay: time to 0
    d: f32,
    // if true, linear. otherwise exponential
    l: Option<bool>,
    // start
    s: Option<f32>,
}

#[derive(Deserialize)]
enum FloatInput {
    F(f32),
    N(usize),
}

// Biquad filter time!
// https://en.wikipedia.org/wiki/Digital_biquad_filter
// to implement this, we need to store the historic state.
// Maybe look at this for a biquad filter: https://webaudio.github.io/Audio-EQ-Cookbook/Audio-EQ-Cookbook.txt

enum Node {
    Noise {
        t: Option<NoiseType>,
    },
    Osc {
        // frequency
        f: FloatInput,
        // type of wave
        t: Option<WaveType>,
        // phase
        p: Option<FloatInput>,
        // the following are mostly useful for low frequency oscilators.
        //
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
    Delay {
        i: Vec<usize>,
        // delay, must be positive
        d: f32,
    },
    Biquad {
        i: usize,
        // params from https://en.wikipedia.org/wiki/Digital_biquad_filter
        // we'll work out what they mean later.
        a: [f32; 3],
        b: [f32; 3],
    },
}

// this lets us go from various filters to a single form
impl From<SerializedNode> for Node {
    fn from(node: SerializedNode) -> Node {
        match node {
            SerializedNode::Noise { t } => Node::Noise { t },
            // https://gist.github.com/devbisme/7a4375e83f642e2a53247977315104c0
            SerializedNode::Biquad { i, t } => {
                let mut a = [0.0, 0.0, 0.0];
                let mut b = [0.0, 0.0, 0.0];
                match t {
                    FilterType::LPF { f_s, f_0, Q } => {
                        let w_0 = std::f32::consts::TAU * f_0 / f_s;
                        let alpha = w_0.sin() / (2.0 * Q);

                        // used: https://www.earlevel.com/main/2021/09/02/biquad-calculator-v3/
                        // for validation
                        //
                        // it swaps the names for a / b relative to https://webaudio.github.io/Audio-EQ-Cookbook/Audio-EQ-Cookbook.txt
                        // though..
                        b[1] = 1.0 - w_0.cos();
                        b[0] = 0.5 * b[1];
                        b[2] = b[0];
                        a[0] = 1.0 + alpha;
                        a[1] = -2.0 * w_0.cos();
                        a[2] = 1.0 - alpha;
                    }
                }
                Node::Biquad { i, a, b }
            }
            SerializedNode::Osc { f, t, p, s, o } => Node::Osc { f, t, p, s, o },
            SerializedNode::Gain { i, g, e } => Node::Gain { i, g, e },
            SerializedNode::Delay { i, d } => Node::Delay { i, d },
        }
    }
}

#[derive(Deserialize)]
enum FilterType {
    LPF { f_s: f32, f_0: f32, Q: f32 },
}

#[derive(Deserialize)]
enum SerializedNode {
    Noise {
        t: Option<NoiseType>,
    },
    Osc {
        // frequency
        f: FloatInput,
        // type of wave
        t: Option<WaveType>,
        // phase
        p: Option<FloatInput>,
        // the following are mostly useful for low frequency oscilators.
        //
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
    Delay {
        i: Vec<usize>,
        // delay, must be positive
        d: f32,
    },
    Biquad {
        i: usize,
        // params from https://en.wikipedia.org/wiki/Digital_biquad_filter
        // we'll work out what they mean later.
        t: FilterType,
    },
}

struct AudioData {
    nodes: Vec<Node>,
    // computed values
    v: Vec<Vec<f32>>,
    // for each channel, which node it takes as input.
    channel_inputs: Vec<usize>,
    // nodes to apply in order
    post_processing: Option<Vec<PostProcessNode>>,
}

impl AudioData {
    fn new(params: AudioParams) -> Self {
        let v = params.nodes.iter().map(|_n| Vec::new()).collect();
        Self {
            nodes: params.nodes.into_iter().map(|n| Node::from(n)).collect(),
            v,
            channel_inputs: params.channel_inputs,
            post_processing: params.post_processing,
        }
    }

    fn value_at(
        values: &mut Vec<Vec<f32>>,
        nodes: &Vec<Node>,
        generator: &AudioGenerator,
        node_idx: usize,
        time_idx: usize,
    ) -> f32 {
        if values[node_idx].len() <= time_idx {
            // generate values up to time_idx
            for i in values[node_idx].len()..(time_idx + 1) {
                let v = AudioData::value_at_uncached(values, nodes, generator, node_idx, i);
                values[node_idx].push(v);
            }
        }
        values[node_idx][time_idx]
    }

    fn value_at_uncached(
        values: &mut Vec<Vec<f32>>,
        nodes: &Vec<Node>,
        generator: &AudioGenerator,
        node_idx: usize,
        time_idx: usize,
    ) -> f32 {
        let time = (time_idx as f32) / (generator.sample_frequency as f32);
        match &nodes[node_idx] {
            Node::Noise { t } => generator
                .noise_buffers
                .value_at(t.as_ref().unwrap_or(&NoiseType::White), time_idx),
            Node::Delay { i, d } => {
                let time = (time_idx as f32) / (generator.sample_frequency as f32) - d;
                if time < 0.0 {
                    0.0
                } else {
                    let mut total = 0.0;
                    let time_idx = ((generator.sample_frequency as f32) * time) as usize;
                    for index in 0..i.len() {
                        total += AudioData::value_at(values, nodes, generator, i[index], time_idx);
                    }
                    total
                }
            }
            Node::Biquad { i, a, b } => {
                let x_0 = AudioData::value_at(values, nodes, generator, *i, time_idx);

                let (x_1, y_1) = if time_idx >= 1 {
                    (
                        AudioData::value_at(values, nodes, generator, *i, time_idx - 1),
                        AudioData::value_at(values, nodes, generator, node_idx, time_idx - 1),
                    )
                } else {
                    (0.0, 0.0)
                };
                let (x_2, y_2) = if time_idx >= 2 {
                    (
                        AudioData::value_at(values, nodes, generator, *i, time_idx - 2),
                        AudioData::value_at(values, nodes, generator, node_idx, time_idx - 2),
                    )
                } else {
                    (0.0, 0.0)
                };

                (b[0] * x_0 + b[1] * x_1 + b[2] * x_2 - a[1] * y_1 - a[2] * y_2) / a[0]
            }
            Node::Osc { f, t, p, s, o } => {
                let f = match f {
                    FloatInput::F(float) => *float,
                    FloatInput::N(index) => {
                        AudioData::value_at(values, nodes, generator, *index, time_idx)
                    }
                };

                let p = match p {
                    None => 0.0,
                    Some(FloatInput::F(float)) => *float,
                    Some(FloatInput::N(index)) => {
                        AudioData::value_at(values, nodes, generator, *index, time_idx)
                    }
                };

                let multiple = 2.0 * std::f32::consts::PI * f;
                let wave_type = t.as_ref().unwrap_or(&WaveType::Sin);
                let scale = s.unwrap_or(1.0);
                let offset = o.unwrap_or(0.0);
                let angle = (time * multiple + p) % (2.0 * std::f32::consts::PI);

                let v = match wave_type {
                    WaveType::Sin => angle.sin(),
                    WaveType::Tri => {
                        let half_angle = angle % std::f32::consts::PI;

                        let value = 2.0 * half_angle.min(std::f32::consts::PI - half_angle)
                            / std::f32::consts::PI;

                        if angle > std::f32::consts::PI {
                            -value
                        } else {
                            value
                        }
                    }
                    WaveType::Saw => angle / (2.0 * std::f32::consts::PI),
                    WaveType::Sqr => {
                        if (std::f32::consts::PI - angle).is_sign_positive() {
                            1.0
                        } else {
                            -1.0
                        }
                    }
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
                                let x: f32 = 1.0;
                                let rescale = x.exp() / (1.0 - x.exp());

                                (-t * x).exp() * rescale - rescale
                            }
                        }
                    };
                let mut total = 0.0;
                for n in 0..i.len() {
                    total += AudioData::value_at(values, nodes, generator, i[n], time_idx);
                }
                gain * total
            }
        }
    }

    fn fill_channels(
        &mut self,
        generator: &AudioGenerator,
        left: Float32Array,
        right: Float32Array,
    ) {
        let frame_count = left.length();
        for i in 0..(frame_count as usize) {
            left.set_index(
                i as u32,
                Self::value_at(
                    &mut self.v,
                    &self.nodes,
                    generator,
                    self.channel_inputs[0],
                    i,
                ),
            );
            right.set_index(
                i as u32,
                Self::value_at(
                    &mut self.v,
                    &self.nodes,
                    generator,
                    self.channel_inputs[1],
                    i,
                ),
            );
        }

        match &self.post_processing {
            None => {}
            Some(post_processing) => {
                for i in 0..post_processing.len() {
                    post_processing[i].apply(&left);
                    post_processing[i].apply(&right);
                }
            }
        }
    }
}

#[derive(Deserialize)]
enum PostProcessNode {
    DynamicRange { max: f32 },
}

impl PostProcessNode {
    fn apply(&self, sound_clip: &Float32Array) {
        match self {
            PostProcessNode::DynamicRange { max } => {
                let mut min_val: f32 = 10000000.0;
                let mut max_val: f32 = -100000000.0;

                // scan to find actual max/min.
                for i in 0..sound_clip.length() {
                    let v = sound_clip.at(i as i32).unwrap();

                    min_val = min_val.min(v);
                    max_val = max_val.max(v);
                }

                // rescale the wave
                let scale = 2.0 * max / (max_val - min_val);

                for i in 0..sound_clip.length() {
                    sound_clip.set_index(i, sound_clip.at(i as i32).unwrap() * scale);
                }
            }
        }
    }
}

#[derive(Deserialize)]
struct AudioParams {
    nodes: Vec<SerializedNode>,
    // for each channel, which node it takes as input.
    channel_inputs: Vec<usize>,
    // nodes to apply in order
    post_processing: Option<Vec<PostProcessNode>>,
}

#[wasm_bindgen]
impl AudioGenerator {
    #[wasm_bindgen(constructor)]
    pub fn new(sample_frequency: usize, max_sample_length: usize) -> Self {
        console_error_panic_hook::set_once();
        Self {
            sample_frequency: sample_frequency,
            max_sample_length: max_sample_length,
            noise_buffers: NoiseBuffers::new(sample_frequency),
        }
    }

    pub fn generate(&self, params: JsValue, left: Float32Array, right: Float32Array) {
        let params: AudioParams = serde_wasm_bindgen::from_value(params).unwrap();

        let mut data = AudioData::new(params);

        data.fill_channels(self, left, right);
    }
}
