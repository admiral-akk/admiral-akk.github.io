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

        for i in (self.planes.len() - 1)..0 {
            // check if the plane ever creates a non-empty line
            let mut has_line = false;
            let plane = self.planes[i];
            for j in (self.planes.len() - 1)..0 {
                let other = self.planes[j];
                let line_opt = plane.intersection(&other, None);
                match line_opt {
                    None => continue,
                    Some(line) => {
                        // check if the line has non-zero length;

                        has_line = true;
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
