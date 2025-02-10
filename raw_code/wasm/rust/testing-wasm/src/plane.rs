use crate::types::*;
use wasm_bindgen::prelude::*;

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

    pub fn dist(&self, p: &Vec3) -> f32 {
        self.normal.dot(p) - self.offset
    }

    pub fn invert(&mut self) -> Self {
        self.normal.scale(-1.);
        self.offset *= -1.;
        self
    }

    pub fn intersection(&self, other: &Plane, opt_epsilon: Option<f32>) -> Option<Line> {
        let epsilon = match opt_epsilon {
            Some(e) => e,
            None => 0.0001,
        };
        let mut line_dir = (&self.normal.clone()).cross(&other.normal);
        if line_dir.length() <= epsilon {
            return None;
        }

        line_dir.normalize();

        let largest_index = if line_dir.x.abs() >= line_dir.y.abs().max(line_dir.z.abs()) {
            0
        } else if line_dir.y.abs() >= (line_dir.z.abs()) {
            1
        } else {
            2
        };

        // other1 = largest_index == 0 ? y : x
        // other2 = largest_index != 2 ? z : y

        let p1v1 = if largest_index == 0 {
            self.normal.y
        } else {
            self.normal.x
        };
        let p1v2 = if largest_index != 2 {
            self.normal.z
        } else {
            self.normal.y
        };
        let p2v1 = if largest_index == 0 {
            other.normal.y
        } else {
            other.normal.x
        };
        let p2v2 = if largest_index != 2 {
            other.normal.z
        } else {
            other.normal.y
        };

        let diff = p1v1 * p2v2 - p1v2 * p2v1;

        let x = if largest_index == 0 {
            0.
        } else {
            self.offset * p2v2 - other.offset * p1v2
        };
        let y = if largest_index == 0 {
            self.offset * p2v2 - other.offset * p1v2
        } else if largest_index == 2 {
            -(self.offset * p2v1 - other.offset * p1v1)
        } else {
            0.
        };
        let z = if largest_index != 2 {
            -(self.offset * p2v1 - other.offset * p1v1)
        } else {
            0.
        };

        Some(Line::new(
            &mut line_dir,
            Vec3::new(x, y, z).scale(1. / diff),
        ))
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

    #[test]
    fn test_no_intersection() {
        let plane1 = &Plane::new(&mut Vec3::new(1., 0., 0.), 0.);
        let plane2 = &Plane::new(&mut Vec3::new(1., 0., 0.), 0.);

        assert_eq!(plane1.intersection(plane2, None), None);
    }

    #[test]
    fn test_orthogonal_intersection() {
        let plane1 = &Plane::new(&mut Vec3::new(1., 0., 0.), 0.);
        let plane2 = &Plane::new(&mut Vec3::new(0., 1., 0.), 0.);

        let expected = Line::new(&mut Vec3::new(0., 0., 1.), Vec3::new(0., 0., 0.));
        assert_eq!(plane1.intersection(plane2, None), Some(expected));
    }

    #[test]
    fn test_orthogonal_intersection_with_offset() {
        let plane1 = &Plane::new(&mut Vec3::new(1., 0., 0.), 10.);
        let plane2 = &Plane::new(&mut Vec3::new(0., 0., 1.), 10.);

        let expected = Line::new(&mut Vec3::new(0., -1., 0.), Vec3::new(10., 0., 10.));
        assert_eq!(plane1.intersection(plane2, None), Some(expected));
    }
}
