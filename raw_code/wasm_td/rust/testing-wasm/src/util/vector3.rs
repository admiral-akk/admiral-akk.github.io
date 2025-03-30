pub trait Vector3: Sized + Clone + Copy {
    fn x(&self) -> f32;
    fn y(&self) -> f32;
    fn z(&self) -> f32;
    fn set_x(&mut self, val: f32);
    fn set_y(&mut self, val: f32);
    fn set_z(&mut self, val: f32);

    fn new(v: [f32; 3]) -> Self;

    fn length(&self) -> f32 {
        self.length_sq().sqrt()
    }

    fn scale(&mut self, scalar: f32) -> &mut Self {
        self.set_x(self.x() * scalar);
        self.set_y(self.y() * scalar);
        self.set_z(self.z() * scalar);
        self
    }

    fn normalize(&mut self) -> &mut Self {
        self.scale(1.0 / self.length())
    }

    fn length_sq(&self) -> f32 {
        (&self).dot(self)
    }

    fn add<T: Vector3>(&mut self, other: &T) -> &mut Self {
        self.set_x(self.x() + other.x());
        self.set_y(self.y() + other.y());
        self.set_z(self.z() + other.z());
        self
    }

    fn sub<T: Vector3>(&mut self, other: &T) -> &mut Self {
        self.set_x(self.x() - other.x());
        self.set_y(self.y() - other.y());
        self.set_z(self.z() - other.z());
        self
    }

    fn mul<T: Vector3>(&mut self, other: &T) -> &mut Self {
        self.set_x(self.x() * other.x());
        self.set_y(self.y() * other.y());
        self.set_z(self.z() * other.z());
        self
    }

    fn cross<T: Vector3>(&self, other: &T) -> Self {
        let x = self.y() * other.z() - self.z() * other.y();
        let y = self.z() * other.x() - self.x() * other.z();
        let z = self.x() * other.y() - self.y() * other.x();
        Self::new([x, y, z])
    }

    fn dot<T: Vector3>(&self, other: &T) -> f32 {
        self.x() * other.x() + self.y() * other.y() + self.z() * other.z()
    }

    fn lerp<T: Vector3>(&self, other: &T, v: f32) -> Self {
        let t = v.max(0.0).min(1.0);
        Self::new([
            self.x() * (1.0 - t) + other.x() * t,
            self.y() * (1.0 - t) + other.y() * t,
            self.z() * (1.0 - t) + other.z() * t,
        ])
    }
}
impl Vector3 for [f32; 3] {
    #[inline(always)]
    fn set_x(&mut self, val: f32) {
        self[0] = val;
    }

    #[inline(always)]
    fn set_y(&mut self, val: f32) {
        self[1] = val;
    }

    #[inline(always)]
    fn set_z(&mut self, val: f32) {
        self[2] = val;
    }

    #[inline(always)]
    fn x(&self) -> f32 {
        self[0]
    }

    #[inline(always)]
    fn y(&self) -> f32 {
        self[1]
    }

    #[inline(always)]
    fn z(&self) -> f32 {
        self[2]
    }

    #[inline(always)]
    fn new(v: [f32; 3]) -> Self {
        v
    }
}
