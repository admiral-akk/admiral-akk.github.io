use crate::types::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq)]
pub struct Brush {
    planes: Vec<Plane>,
}

#[wasm_bindgen]
impl Brush {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Brush {
        Self {
            planes: vec![
                Plane::new(&mut Vec3::new(1., 0., 0.), -100000.),
                Plane::new(&mut Vec3::new(-1., 0., 0.), -100000.),
                Plane::new(&mut Vec3::new(0., 1., 0.), -100000.),
                Plane::new(&mut Vec3::new(0., -1., 0.), -100000.),
                Plane::new(&mut Vec3::new(0., 0., 1.), -100000.),
                Plane::new(&mut Vec3::new(0., 0., -1.), -100000.),
            ],
        }
    }

    pub fn to_string(&self) -> String {
        format!("{:?}", self)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_new() {
        let brush = Brush::new();
    }
}
