use crate::mesh::*;
use crate::model::model_generator::Vector3;
use js_sys::Uint8Array;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

struct Texture {
    color: Vec<OkLabColor>,
    width: usize,
    height: usize,
}

impl Texture {
    fn get(&self, x: usize, y: usize) -> &OkLabColor {
        &self.color[x + y * self.width]
    }

    fn sample(&self, uv: [f32; 2]) -> RgbColor {
        let x = uv[0] * ((self.width - 1) as f32);
        let y = uv[1] * ((self.height - 1) as f32);

        let x_index = x.floor() as usize;
        let y_index = y.floor() as usize;

        let x_weight = (x - x_index as f32) / ((self.width - 1) as f32);
        let y_weight = (y - y_index as f32) / ((self.height - 1) as f32);

        let top = self
            .get(x_index + 1, y_index)
            .lerp(self.get(x_index, y_index), x_weight);
        let bot = self
            .get(x_index + 1, y_index + 1)
            .lerp(self.get(x_index, y_index + 1), x_weight);
        //
        RgbColor::from(bot.lerp(&top, y_weight))
    }

    pub fn fill_array(&self, arr: &Uint8Array, width: usize, height: usize) {}
}

#[wasm_bindgen]
pub struct TextureGenerator {
    textures: HashMap<String, Texture>,
}

#[derive(Clone, Copy, Debug, PartialEq, Deserialize, Serialize)]
pub struct OkLabColor {
    l: f32,
    c: f32,
    h: f32,
}

#[derive(Clone, Copy, Debug, PartialEq, Deserialize, Serialize)]
pub struct RgbColor {
    r: f32,
    g: f32,
    b: f32,
}

#[derive(Clone, Copy, Debug, PartialEq, Deserialize, Serialize)]
pub enum Color {
    Rgb(RgbColor),
    Oklab(OkLabColor),
}

impl From<Color> for RgbColor {
    fn from(c: Color) -> Self {
        match c {
            Color::Rgb(rgb) => rgb,
            Color::Oklab(oklab) => RgbColor::from(oklab),
        }
    }
}

impl From<Color> for OkLabColor {
    fn from(c: Color) -> Self {
        match c {
            Color::Rgb(rgb) => OkLabColor::from(rgb),
            Color::Oklab(oklab) => oklab,
        }
    }
}

impl Vector3 for OkLabColor {
    #[inline(always)]
    fn set_x(&mut self, val: f32) {
        self.l = val;
    }

    #[inline(always)]
    fn set_y(&mut self, val: f32) {
        self.c = val;
    }

    #[inline(always)]
    fn set_z(&mut self, val: f32) {
        self.h = val;
    }

    #[inline(always)]
    fn x(&self) -> f32 {
        self.l
    }

    #[inline(always)]
    fn y(&self) -> f32 {
        self.c
    }

    #[inline(always)]
    fn z(&self) -> f32 {
        self.h
    }

    #[inline(always)]
    fn new(v: [f32; 3]) -> Self {
        Self {
            l: v[0],
            c: v[1],
            h: v[2],
        }
    }
}

// https://bottosson.github.io/posts/oklab/
impl From<OkLabColor> for RgbColor {
    fn from(c: OkLabColor) -> Self {
        let a = c.h.cos() * c.c;
        let b = c.h.sin() * c.c;

        let l_ = c.l + 0.3963377774 * a + 0.2158037573 * b;
        let m_ = c.l - 0.1055613458 * a - 0.0638541728 * b;
        let s_ = c.l - 0.0894841775 * a - 1.2914855480 * b;

        let l = l_ * l_ * l_;
        let m = m_ * m_ * m_;
        let s = s_ * s_ * s_;

        return RgbColor {
            r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
            g: 1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
            b: 0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
        };
    }
}

impl From<RgbColor> for OkLabColor {
    fn from(c: RgbColor) -> Self {
        let l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
        let m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
        let s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;

        let l_ = l.cbrt();
        let m_ = m.cbrt();
        let s_ = s.cbrt();

        let a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
        let b = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

        return OkLabColor {
            l: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
            c: (a * a + b * b).sqrt(),
            h: b.atan2(a),
        };
    }
}

#[derive(Serialize, Deserialize)]
enum TextureParams {
    ColorGradient(ColorGradientParams),
}

#[derive(Serialize, Deserialize)]
struct ColorGradientParams {
    // tl, tr, bl, br
    colors: [Color; 4],
}
trait TextureGen {
    fn generate_texture(&self, tex_gen: &TextureGenerator) -> Texture;
}

impl TextureGen for ColorGradientParams {
    fn generate_texture(&self, tex_gen: &TextureGenerator) -> Texture {
        Texture {
            color: self.colors.iter().map(|c| OkLabColor::from(*c)).collect(),
            width: 2,
            height: 2,
        }
    }
}

impl TextureGen for TextureParams {
    fn generate_texture(&self, tex_gen: &TextureGenerator) -> Texture {
        match self {
            TextureParams::ColorGradient(params) => params.generate_texture(tex_gen),
        }
    }
}

impl TextureGenerator {
    fn get_texture_internal(&self, name: &str) -> &Texture {
        self.textures.get(name.into()).unwrap()
    }
}

#[wasm_bindgen]
impl TextureGenerator {
    #[wasm_bindgen(constructor)]
    pub fn new() -> TextureGenerator {
        TextureGenerator {
            textures: HashMap::new(),
        }
    }

    pub fn fill_array(&self, name: &str, arr: &Uint8Array, width: u32, height: u32) {
        let texture = self.get_texture_internal(name);
        for i in 0..(arr.length() / 3) {
            let x = i % width;
            let y = i / width;
            let uv = [
                x as f32 / (width - 1) as f32,
                y as f32 / (height - 1) as f32,
            ];
            let color = texture.sample(uv);
            arr.set_index(3 * (i as u32), (color.r * 255.0) as u8);
            arr.set_index(3 * (i as u32) + 1, (color.g * 255.0) as u8);
            arr.set_index(3 * (i as u32) + 2, (color.b * 255.0) as u8);
        }
    }

    pub fn generate_texture(&mut self, name: &str, params: JsValue) {
        let params: TextureParams = serde_wasm_bindgen::from_value(params).unwrap();
        let tex = params.generate_texture(&self);
        self.textures.insert(name.into(), tex);
    }
}
