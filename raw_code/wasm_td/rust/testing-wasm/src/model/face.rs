use crate::util::client_array::ClientArray;
use crate::util::vector3::Vector3;

trait Metadata: Sized + Copy {
    fn len() -> usize;
}

#[derive(Copy, Clone)]
pub struct UvMetadata {
    uv: [f32; 2],
}

impl Metadata for UvMetadata {
    fn len() -> usize {
        2
    }
}

pub struct Face {
    vertices: Vec<usize>,
}

impl Face {
    pub fn new(vertices: Vec<usize>) -> Self {
        Face { vertices }
    }
}

pub struct FaceModel {
    faces: Vec<Face>,
    vertices: Vec<([f32; 3], UvMetadata)>,
}

pub trait Transform<V: Vector3, M: Metadata> {
    fn apply(&self, v: &mut (V, M));
}

pub struct Translate(pub [f32; 3]);

impl<T: Vector3, M: Metadata> Transform<T, M> for Translate {
    fn apply(&self, v: &mut (T, M)) {
        v.0.add(&self.0);
    }
}

pub struct Scale(pub [f32; 3]);

impl<T: Vector3, M: Metadata> Transform<T, M> for Scale {
    fn apply(&self, v: &mut (T, M)) {
        v.0.mul(&self.0);
    }
}

pub struct UvOffset(pub [f32; 2]);

impl<T: Vector3> Transform<T, UvMetadata> for UvOffset {
    fn apply(&self, v: &mut (T, UvMetadata)) {
        v.1.uv[0] += self.0[0];
        v.1.uv[1] += self.0[1];
    }
}

impl FaceModel {
    pub fn new(base: Vec<[f32; 4]>) -> Self {
        let mut vertices = Vec::new();

        for v in base.iter() {
            vertices.push(([v[0], 0.0, v[1]], UvMetadata { uv: [v[2], v[3]] }));
        }

        for i in (0..base.len()).rev() {
            let v = &base[i];
            vertices.push(([v[0], 1.0, v[1]], UvMetadata { uv: [v[2], v[3]] }));
        }

        let bottom = Face::new((0..base.len()).collect());
        let top = Face::new((base.len()..vertices.len()).collect());

        let mut faces = vec![bottom];

        for i in 0..base.len() {
            let face = Face::new(vec![
                vertices.len() - 1 - i,
                vertices.len() - 1 - ((i + 1) % base.len()),
                (i + 1) % base.len(),
                i,
            ]);
            faces.push(face);
        }

        faces.push(top);

        FaceModel { faces, vertices }
    }

    // adds a ring of vertices at the face's current location.
    // replaces all existing connections to the face with the ring.
    // connects the ring to the current face.
    // returns a list of indices corresponding to the new faces.
    pub fn duplicate(&mut self, index: usize) -> Vec<usize> {
        let mut index_pairs = Vec::new();
        for i in 0..self.faces[index].vertices.len() {
            self.vertices.push(self.vertices[i].clone());
            self.faces[index].vertices[i] = self.vertices.len() - 1;
            index_pairs.push((i, self.vertices.len() - 1));
        }
        (0..index_pairs.len())
            .map(|i| {
                let (prev_low, prev_high) = index_pairs[i];

                self.faces[index].vertices[i] = prev_high;
                let (next_low, next_high) = index_pairs[(i + 1) % index_pairs.len()];
                self.faces
                    .push(Face::new(vec![prev_low, next_low, next_high, prev_high]));
                self.faces.len() - 1
            })
            .collect()
    }

    pub fn apply_transform<T: Transform<[f32; 3], UvMetadata>>(
        &mut self,
        transform: &T,
        face_index: usize,
    ) {
        for i in self.faces[face_index].vertices.iter() {
            transform.apply(&mut self.vertices[*i]);
        }
    }

    pub fn size(&self) -> usize {
        self.faces
            .iter()
            .map(|f| (f.vertices.len() - 2) * 8 * 3)
            .fold(0, |acc, x| acc + x)
    }

    pub fn fill_array(&self, arr: &mut dyn ClientArray<f32>, start: Option<usize>) {
        let mut start = match start {
            Some(start) => start,
            None => 0,
        };

        for face in self.faces.iter() {
            for i in 1..(face.vertices.len() - 1) {
                let v1 = &self.vertices[face.vertices[0]];
                let v2 = &self.vertices[face.vertices[i]];
                let v3 = &self.vertices[face.vertices[i + 1]];

                let v21 = *v2.0.clone().sub(&v1.0);
                let v31 = *v3.0.clone().sub(&v1.0);

                let mut normal = v31.cross(&v21);

                if normal.length_sq() < 0.0001 {
                    continue;
                }
                normal.normalize();

                start += arr.set_values(start, &v1.0);
                start += arr.set_values(start, &normal);
                start += arr.set_values(start, &v1.1.uv);

                start += arr.set_values(start, &v2.0);
                start += arr.set_values(start, &normal);
                start += arr.set_values(start, &v2.1.uv);

                start += arr.set_values(start, &v3.0);
                start += arr.set_values(start, &normal);
                start += arr.set_values(start, &v3.1.uv);
            }
        }
    }
}
