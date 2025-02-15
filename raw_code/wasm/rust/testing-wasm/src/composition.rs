use crate::brush::*;
use crate::types::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq)]
pub struct Composition {
    brushes: Vec<Brush>,
}

#[wasm_bindgen]
impl Composition {
    #[wasm_bindgen(constructor)]
    pub fn new(brush: Brush) -> Composition {
        Self {
            brushes: vec![brush],
        }
    }

    pub fn to_string(&self) -> String {
        format!("{:?}", self)
    }

    fn sub_plane(&mut self, other: &Plane) {
        for i in (0..self.brushes.len()).rev() {
            let brush = &mut self.brushes[i];
            let inv_other = other.clone().invert();
            brush.add_plane(&inv_other);
            if brush.empty() {
                self.brushes.swap_remove(i);
            }
        }
    }

    fn sub_brush(&mut self, other: &Brush) {
        for plane in other.get_planes().iter() {
            self.sub_plane(&plane.clone())
        }
    }

    pub fn sub(&mut self, other: &Composition) {
        for brush in other.brushes.iter() {
            if brush.empty() {
                continue;
            }
            self.sub_brush(brush)
        }
    }
}

#[cfg(test)]
mod tests {
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
    fn test_add_composition() {}
}
