use crate::types::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Line {
    #[wasm_bindgen(constructor)]
    pub fn new(dir: &mut Vec3, start: Vec3) -> Line {
        Self {
            dir: dir.normalize(),
            start,
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
        let line = Line::new(&mut Vec3::new(1., 1., 1.), Vec3::new(0., 0., 0.));

        let sqrt_1_3 = 1. / (3. as f32).sqrt();
        let expected_dir = Vec3::new(sqrt_1_3, sqrt_1_3, sqrt_1_3);

        assert_eq!(line.dir, expected_dir);
        assert_eq!(line.start, Vec3::new(0., 0., 0.));
    }
}
