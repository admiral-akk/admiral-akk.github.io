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

    pub fn point(&self, t: f32) -> Vec3 {
        self.start.clone().scale_and_add(t, &self.dir)
    }

    pub fn closest(&self, p: &Vec3) -> Vec3 {
        let mut start = self.start.clone();

        if (p.dist_sq(&start) < 0.001) {
            start.add(&self.dir);
        }

        let mut delta = p.clone();
        delta.sub(&start);
        start.scale_and_add(delta.dot(&self.dir), &self.dir);

        start
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

    #[test]
    fn test_point() {
        let line = Line::new(&mut Vec3::new(1., 0., 0.), Vec3::new(0., 0., 1.));

        assert_eq!(line.point(0.), Vec3::new(0., 0., 1.));
        assert_eq!(line.point(2.), Vec3::new(2., 0., 1.));
        assert_eq!(line.point(-2.), Vec3::new(-2., 0., 1.));
    }

    #[test]
    fn test_closest_point_on_line() {
        let line = Line::new(&mut Vec3::new(1., 0., 0.), Vec3::new(0., 0., 1.));

        assert_eq!(line.closest(&line.point(0.)), Vec3::new(0., 0., 1.));
        assert_eq!(line.closest(&line.point(2.)), Vec3::new(2., 0., 1.));
        assert_eq!(line.closest(&line.point(-2.)), Vec3::new(-2., 0., 1.));
    }
}
