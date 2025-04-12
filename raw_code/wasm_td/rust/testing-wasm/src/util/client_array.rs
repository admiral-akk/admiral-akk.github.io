use js_sys::Float32Array;
use js_sys::Uint8Array;

pub trait ClientArray<V> {
    // inserts the value(s) starting at the index, and returns the
    // number of values inserted;
    fn set_value(&mut self, start: usize, v: &V) -> usize;
    fn set_values(&mut self, start: usize, v: &[V]) -> usize {
        let mut offset = 0;
        for val in v.iter() {
            offset += self.set_value(start + offset, &val);
        }
        offset
    }
}

impl ClientArray<f32> for Float32Array {
    fn set_value(&mut self, start: usize, v: &f32) -> usize {
        self.set_index(start as u32, *v);
        1
    }
}

impl ClientArray<u8> for Uint8Array {
    fn set_value(&mut self, start: usize, v: &u8) -> usize {
        self.set_index(start as u32, *v);
        1
    }
}
