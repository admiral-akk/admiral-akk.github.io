use js_sys::Float32Array;

pub trait Serialize<const N: u32> {
    fn get(&self, index: u32) -> f32;
    fn insert(&self, array: &Float32Array, offset: u32) {
        for i in 0..N {
            array.set_index(offset + i, self.get(i));
        }
    }
}
