import type { CodeRef } from '@/components/code/types';

export const linearCodeRefs: Record<string, CodeRef> = {
  'linear-struct': {
    path: 'src/lib.rs — Linear struct + forward',
    lang: 'rust',
    highlight: [1, 38],
    desc: 'Linear 레이어: y = x @ W + b.\nW는 lazy init — 첫 forward 호출 시 입력 크기를 감지해 Xavier 초기화.',
    code: `pub struct Linear {
    out_size: usize,
    // 첫 forward 호출 전까지 None (lazy init)
    // 입력 데이터가 와야 in_size를 알 수 있기 때문
    w: RefCell<Option<Variable>>,
    b: Variable,
    rng_state: Cell<u64>,  // W 초기화용 난수 시드
}

impl Linear {
    pub fn forward(&self, x: &Variable) -> Variable {
        if self.w.borrow().is_none() {
            let in_size = x.shape()[1];
            let scale = (1.0 / in_size as f64).sqrt(); // Xavier
            let w_data: Vec<f64> = (0..in_size * self.out_size)
                .map(|_| self.next_normal() * scale)
                .collect();
            *self.w.borrow_mut() = Some(Variable::new(
                ArrayD::from_shape_vec(
                    IxDyn(&[in_size, self.out_size]),
                    w_data,
                ).unwrap(),
            ));
        }
        linear(x, self.w.borrow().as_ref().unwrap(), Some(&self.b))
    }

    // LCG 기반 균등분포 [0, 1) 난수 생성
    fn next_f64(&self) -> f64 {
        let state = self.rng_state.get()
            .wrapping_mul(6364136223846793005)
            .wrapping_add(1442695040888963407);
        self.rng_state.set(state);
        (state >> 11) as f64 / (1u64 << 53) as f64
    }

    // Box-Muller 변환: 균등분포 → 정규분포
    fn next_normal(&self) -> f64 {
        let u1 = self.next_f64();
        let u2 = self.next_f64();
        (-2.0 * u1.ln()).sqrt() * (2.0 * PI * u2).cos()
    }
}`,
    annotations: [
      { lines: [3, 5], color: 'sky', note: 'lazy init — forward 전까지 W가 None. 입력 shape를 몰라도 레이어 생성 가능' },
      { lines: [14, 14], color: 'emerald', note: 'Xavier 초기화: sqrt(1/in_size) — 층마다 분산이 일정하게 유지' },
      { lines: [29, 34], color: 'amber', note: 'LCG(Linear Congruential Generator) — 외부 RNG 없이 재현 가능한 난수' },
      { lines: [37, 41], color: 'violet', note: 'Box-Muller: 균등분포 2개 → 정규분포 1개 변환' },
    ],
  },
  'matmul-fn': {
    path: 'src/lib.rs — MatMulFn',
    lang: 'rust',
    highlight: [1, 15],
    desc: '행렬 곱셈 함수와 역전파.\ngx = gy @ W^T, gw = x^T @ gy — 행렬 전치로 방향 역전.',
    code: `struct MatMulFn;

impl Function for MatMulFn {
    fn forward(&self, xs: &[ArrayD<f64>]) -> Vec<ArrayD<f64>> {
        let x = xs[0].view().into_dimensionality::<Ix2>().unwrap();
        let w = xs[1].view().into_dimensionality::<Ix2>().unwrap();
        vec![x.dot(&w).into_dyn()]
    }
    fn backward(&self, xs: &[Variable], gys: &[Variable]) -> Vec<Variable> {
        let gx = matmul(&gys[0], &transpose(&xs[1])); // gy @ W^T
        let gw = matmul(&transpose(&xs[0]), &gys[0]);  // x^T @ gy
        vec![gx, gw]
    }
    fn name(&self) -> &str { "MatMul" }
}`,
    annotations: [
      { lines: [10, 10], color: 'sky', note: 'gx = gy @ W^T — 입력에 대한 기울기 (다음 레이어로 전파)' },
      { lines: [11, 11], color: 'emerald', note: 'gw = x^T @ gy — 가중치에 대한 기울기 (옵티마이저가 사용)' },
    ],
  },
};
