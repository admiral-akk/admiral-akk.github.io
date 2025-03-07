use crate::types::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq)]
pub struct Brush {
    planes: Vec<Plane>,
}

impl Brush {
    pub fn get_planes(&self) -> Vec<Plane> {
        self.planes.clone()
    }
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

    pub fn empty(&self) -> bool {
        // If we have fewer than 4 planes, it means we
        // no longer have a closed surface, which can only
        // happen if there weren't any legal points in the brush.
        self.planes.len() < 4
    }

    pub fn add_plane(&mut self, plane: &Plane) {
        if self.empty() {
            return;
        }

        self.planes.push(*plane);

        for i in (0..self.planes.len()).rev() {
            // check if the plane ever creates a non-empty line
            let mut has_line = false;
            let mut is_dominated = false;
            let plane = self.planes[i];
            for j in 0..self.planes.len() {
                let other = self.planes[j];
                let line = plane.intersection(&other, None);
                match line {
                    None => {
                        // check if the normals line up
                        if plane.normal.dot(&other.normal) > 0.9999 && plane.offset < other.offset {
                            is_dominated = true;
                        }
                    }
                    Some(line) => {
                        let mut max_t = 1000000000. as f32;
                        let mut min_t = -1000000000. as f32;
                        for k in 0..self.planes.len() {
                            let other = self.planes[k];
                            let t = line.intersection_t(&other, None);
                            match t {
                                None => {
                                    // check if the line is rejected by the plane
                                    if other.dist(&line.start) < -0.01 {
                                        min_t = 10000000.;
                                        max_t = -10000000.;
                                    }
                                }
                                Some(t) => {
                                    if other.normal.dot(&line.dir) >= 0. {
                                        min_t = min_t.max(t);
                                    } else {
                                        max_t = max_t.min(t);
                                    }
                                }
                            }
                        }

                        // check if the line has non-zero length;
                        has_line |= max_t - 0.0001 >= min_t;
                    }
                }
            }

            if !has_line || is_dominated {
                self.planes.swap_remove(i);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fmt::Debug;

    fn assert_same_elements<T: Debug + PartialEq>(actual: Vec<T>, expected: Vec<T>) {
        let mut missing_expected = Vec::new();
        let mut extra_actual = Vec::new();

        for expected_val in expected.iter() {
            if !actual.contains(expected_val) {
                missing_expected.push(expected_val);
            }
        }
        for actual_val in actual.iter() {
            if !expected.contains(actual_val) {
                extra_actual.push(actual_val);
            }
        }
        assert!(
            extra_actual.len() + missing_expected.len() == 0,
            "missing elements: {:?}\nextra elements: {:?}",
            missing_expected,
            extra_actual
        );
    }

    #[test]
    fn test_add_parallel_plane() {
        let mut brush = Brush::new();

        brush.add_plane(&Plane::new(&mut Vec3::new(1., 0., 0.), 0.));

        let expected_planes = vec![
            Plane::new(&mut Vec3::new(1., 0., 0.), 0.),
            Plane::new(&mut Vec3::new(-1., 0., 0.), -100000.),
            Plane::new(&mut Vec3::new(0., 1., 0.), -100000.),
            Plane::new(&mut Vec3::new(0., -1., 0.), -100000.),
            Plane::new(&mut Vec3::new(0., 0., 1.), -100000.),
            Plane::new(&mut Vec3::new(0., 0., -1.), -100000.),
        ];

        assert_same_elements(brush.planes, expected_planes);
    }

    #[test]
    fn test_add_box() {
        let mut brush = Brush::new();

        let expected_planes = vec![
            Plane::new(&mut Vec3::new(1., 0., 0.), -1.),
            Plane::new(&mut Vec3::new(-1., 0., 0.), -1.),
            Plane::new(&mut Vec3::new(0., 1., 0.), -1.),
            Plane::new(&mut Vec3::new(0., -1., 0.), -1.),
            Plane::new(&mut Vec3::new(0., 0., 1.), -1.),
            Plane::new(&mut Vec3::new(0., 0., -1.), -1.),
        ];

        for plane in expected_planes.iter() {
            brush.add_plane(plane)
        }

        assert_same_elements(brush.planes, expected_planes);
    }

    #[test]
    fn test_rotated_add_box() {
        let mut brush = Brush::new();

        let expected_planes = vec![
            Plane::new(&mut Vec3::new(1., 1., 1.), -1.),
            Plane::new(&mut Vec3::new(-1., 1., 1.), -1.),
            Plane::new(&mut Vec3::new(1., -1., 1.), -1.),
            Plane::new(&mut Vec3::new(1., 1., -1.), -1.),
            Plane::new(&mut Vec3::new(-1., -1., 1.), -1.),
            Plane::new(&mut Vec3::new(-1., 1., -1.), -1.),
            Plane::new(&mut Vec3::new(1., -1., -1.), -1.),
            Plane::new(&mut Vec3::new(-1., -1., -1.), -1.),
        ];

        for plane in expected_planes.iter() {
            brush.add_plane(plane)
        }

        assert_same_elements(brush.planes, expected_planes);
    }

    #[test]
    fn test_pyramid() {
        let mut brush = Brush::new();

        let expected_planes = vec![
            Plane::new(&mut Vec3::new(0., 1., 0.), 0.),
            Plane::new(&mut Vec3::new(1., -1., 1.), -1.),
            Plane::new(&mut Vec3::new(-1., -1., 1.), -1.),
            Plane::new(&mut Vec3::new(1., -1., -1.), -1.),
            Plane::new(&mut Vec3::new(-1., -1., -1.), -1.),
        ];

        for plane in expected_planes.iter() {
            brush.add_plane(plane)
        }

        assert_same_elements(brush.planes, expected_planes);
    }
}
