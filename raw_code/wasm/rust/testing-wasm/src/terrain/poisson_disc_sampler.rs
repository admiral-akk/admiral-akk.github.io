use js_sys::Math;

// https://observablehq.com/@techsparx/an-improvement-on-bridsons-algorithm-for-poisson-disc-samp/2
pub struct PoissonDiscSampler {
    width: f32,
    height: f32,
    radius: f32,
    pub samples: Vec<(f32, f32)>,
}

// samples before rejection
const K: usize = 4;

impl PoissonDiscSampler {
    pub fn new(width: f32, height: f32, radius: f32) -> Self {
        Self {
            width,
            height,
            radius,
            samples: Vec::new(),
        }
    }

    pub fn init(&mut self) {
        let radius2 = self.radius * self.radius;
        let cell_size = self.radius / (2.0 as f32).sqrt();
        let grid_width = (self.width / cell_size).ceil() as usize;
        let grid_height = (self.height / cell_size).ceil() as usize;
        let mut grid = vec![None; (grid_height * grid_width)];
        let mut queue = Vec::new();
        let x = self.width / 2.0;
        let y = self.height / 2.0;
        self.samples.push((x, y));

        grid[grid_width * ((y / cell_size).floor() as usize).min(grid_height - 1)
            + ((x / cell_size).floor() as usize).min(grid_width - 1)] = Some((x, y));
        queue.push((x, y));

        while let Some((x, y)) = queue.pop() {
            let seed = (getrandom::u32().unwrap() % 100000) as f32 / 100000.0;
            let epsilon = 0.0001;

            for j in 0..K {
                let a = 2.0 * std::f32::consts::PI * (seed + (j as f32) / (K as f32));
                let r = self.radius + epsilon;
                let new_x = (x + r * a.cos() + self.width) % self.width;
                let new_y = (y + r * a.sin() + self.height) % self.height;

                let i = (new_x / cell_size).floor() as usize;
                let j = (new_y / cell_size).floor() as usize;
                let mut reject = false;
                for y in (grid_height + j - 2)..(grid_height + j + 3) {
                    if reject {
                        break;
                    }
                    let o = (y % grid_height) * grid_width;
                    for x in (grid_width + i - 2)..(grid_width + i + 3) {
                        if reject {
                            break;
                        }
                        match grid[o + (x % grid_width)] {
                            Some((x, y)) => {
                                let dx = (x - new_x)
                                    .abs()
                                    .min((x - new_x + self.width).abs())
                                    .min((x - new_x - self.width).abs());
                                let dy = (y - new_y)
                                    .abs()
                                    .min((y - new_y + self.width).abs())
                                    .min((y - new_y - self.width).abs());
                                if dx * dx + dy * dy < radius2 {
                                    reject = true;
                                }
                            }
                            None => {}
                        }
                    }
                }
                if !reject {
                    self.samples.push((new_x, new_y));
                    grid[grid_width
                        * ((new_y / cell_size).floor() as usize).min(grid_height - 1)
                        + ((new_x / cell_size).floor() as usize).min(grid_width - 1)] =
                        Some((new_x, new_y));
                    queue.push((new_x, new_y))
                }
            }
        }
        if queue.len() > 0 {
            let index = getrandom::u32().unwrap() as usize % queue.len() as usize;
            let swap_index = queue.len() - 1;
            if swap_index != index {
                queue.swap(index, swap_index);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_new() {
        let mut _poisson = PoissonDiscSampler::new(1.0, 1.0, 0.01);
    }

    #[test]
    fn test_init() {
        let mut poisson = PoissonDiscSampler::new(1.0, 1.0, 0.01);
        poisson.init();
    }
}
