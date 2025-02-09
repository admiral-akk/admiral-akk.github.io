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

    pub fn add_plane(&mut self, plane: &Plane) {
        if self.planes.len() < 4 {
            // this is an empty brush
            return;
        }

        self.planes.push(*plane);

        for i in (self.planes.len() - 1)..0 {
            // check if the plane ever creates a non-empty line
            let mut has_line = false;
            let plane = self.planes[i];
            for j in (self.planes.len() - 1)..0 {
                let other = self.planes[j];
                let line = plane.intersection(&other, None);
                match line {
                    None => continue,
                    Some(line) => {
                        let mut max_t = 1000000000. as f32;
                        let mut min_t = -1000000000. as f32;
                        for k in 0..self.planes.len() {
                            let other = self.planes[k];
                            let t = line.intersection_t(&other, None);
                            match t {
                                None => {}
                                Some(t) => {
                                    if (other.normal.dot(&line.dir) >= 0.) {
                                        min_t = min_t.max(t);
                                    } else {
                                        max_t = max_t.min(t);
                                    }
                                }
                            }
                        }

                        // check if the line has non-zero length;
                        if (max_t - 0.0001 > min_t) {
                            has_line = true;
                        }
                    }
                }
                break;
            }

            if !has_line {
                self.planes.swap_remove(i);
            }
        }
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
