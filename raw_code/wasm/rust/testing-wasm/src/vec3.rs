use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Vec3 {
    x: f32,
    y: f32,
    z: f32,
}

#[wasm_bindgen]
impl Vec3 {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f32,y:f32,z:f32) -> Self {
        Self {
            x,
            y,
            z
        }
    }

    pub fn dot(&self, other: &Vec3) -> f32 {
        let x = self.x * other.x;
        let y = self.y * other.y;
        let z = self.z * other.z;
        self.x * other.x + self.y * other.y + self.z * other.z
    }

    pub fn cross(&self, other: &Vec3) -> Self {
        let x = self.y * other.z - self.z * other.y;
        let y = self.z * other.x - self.x * other.z;
        let z = self.x * other.y - self.y * other.x;
        Vec3::new(x,y,z)
    }

    pub fn length_sq(&self) -> f32 {
        self.dot(self)
    }

    pub fn length(&self) -> f32 {
        self.length_sq().sqrt()
    }

    pub fn normalize(&mut self) -> Self {
        let len = self.length();
        self.x /= len;
        self.y /= len;
        self.z /= len;
        *self
    }

    pub fn set(&mut self,x:f32,y:f32,z:f32) ->  Self {
        self.x = x;
        self.y = y;
        self.z = z;
        *self
    }

    pub fn dist_sq(&self, other: &Vec3) -> f32 {
        let x = self.x - other.x;
        let y = self.y - other.y;
        let z = self.z - other.z;
        x * x + y * y + z * z
    }

    pub fn dist(&self, other: &Vec3) -> f32 {
        self.dist_sq(other).sqrt()
    }

    pub fn to_string(&self) -> String {
        format!("{:?}", self) 
    }

    pub fn add(&mut self, other: &Vec3) -> Self {
        self.x += other.x;
        self.y += other.y;
        self.z += other.z;
        *self
    }

    pub fn sub(&mut self, other: &Vec3) -> Self {
        self.x -= other.x;
        self.y -= other.y;
        self.z -= other.z;
        *self
    }

    pub fn scale(&mut self, scalar: f32) -> Self {
        self.x *= scalar;
        self.y  *= scalar;
        self.z  *= scalar;
        *self
    }

    pub fn scale_and_add(&mut self, scalar: f32, other: &Vec3) -> Self {
        self.x += other.x * scalar;
        self.y += other.y * scalar;
        self.z += other.z * scalar;
        *self
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        let mut v = Vec3::new(1.,2.,3.);
        let other = Vec3::new(4.,5.,6.);
        let expected = Vec3::new(5.,7.,9.);
        assert_eq!(v.add(&other), expected);
        assert_eq!(v, expected);
    }

    #[test]
    fn test_sub() {
        let mut v = Vec3::new(1.,2.,3.);
        let other = Vec3::new(6.,5.,4.);
        let expected = Vec3::new(-5.,-3.,-1.);
        assert_eq!(v.sub(&other), expected);
        assert_eq!(v, expected);
    }

    #[test]
    fn test_normalize() {

        let mut v = Vec3::new(1.,1.,1.);
        let sqrt_1_3 =  1. / (3. as f32).sqrt();
        let expected = Vec3::new(sqrt_1_3,sqrt_1_3,sqrt_1_3);
        assert_eq!(v.normalize(), expected);
        assert_eq!(v, expected);
    }

    #[test]
    fn test_dot() {

        let one = &Vec3::new(1.,1.,0.);
        let neg_one = &one.clone().scale(-1.);
        let orthogonal = &Vec3::new(0.,0.,1.);

        assert_eq!(one.dot(one), 2.);
        assert_eq!(one.dot(neg_one), -2.);
        assert_eq!(one.dot(orthogonal), 0.);
    }
}
