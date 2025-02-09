use crate::vec3::Vec3;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Plane {
    normal: Vec3,
    offset: f32,
}

#[wasm_bindgen]
impl Plane {
    #[wasm_bindgen(constructor)]
    pub fn new(normal: &mut Vec3, offset: f32) -> Plane {
        Self {
            normal: normal.normalize(),
            offset,
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
        let plane = Plane::new(&mut Vec3::new(1., 1., 1.), 10.);

        let sqrt_1_3 = 1. / (3. as f32).sqrt();
        let expected_normal = Vec3::new(sqrt_1_3, sqrt_1_3, sqrt_1_3);

        assert_eq!(plane.normal, expected_normal);
        assert_eq!(plane.offset, 10.);
    }
}
