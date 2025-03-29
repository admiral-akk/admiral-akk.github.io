pub struct Face {
    vertices: Vec<usize>,
}

impl Face {
    pub fn new(vertices: Vec<usize>) -> Self {
        Face { vertices }
    }
}

pub struct FaceModel<Metadata: Sized + Copy> {
    faces: Vec<Face>,
    vertices: Vec<([f32; 3], Metadata)>,
}

impl<Metadata: Sized + Copy> FaceModel<Metadata> {
    pub fn extrude(&mut self, index: usize) -> Vec<usize> {
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
}
