import type { CodeRef } from '@/components/code/types';

export const normCodeRefs: Record<string, CodeRef> = {
  'layer-norm-fn': {
    path: 'src/lib.rs — LayerNormFn forward + backward',
    lang: 'rust',
    highlight: [1, 30],
    desc: 'LayerNorm: feature 축으로 정규화.\ny = gamma * (x - mean) / sqrt(var + eps) + beta.',
    code: `struct LayerNormFn {
    eps: f64,
    x_hat: RefCell<ArrayD<f64>>,   // 정규화된 값 (backward용)
    std_inv: RefCell<ArrayD<f64>>, // 1/sqrt(var+eps)
}

impl Function for LayerNormFn {
    fn forward(&self, xs: &[ArrayD<f64>]) -> Vec<ArrayD<f64>> {
        let x = &xs[0];      // (..., D)
        let gamma = &xs[1];  // (D,) 스케일
        let beta = &xs[2];   // (D,) 시프트

        // mean, var along last axis
        let mean = x.mean_axis(Axis(last)).unwrap(); // (...,)
        let x_centered = x - &mean;                  // broadcast
        let var = x_centered.mapv(|v| v * v)
            .mean_axis(Axis(last)).unwrap();
        let std_inv = var.mapv(|v| 1.0 / (v + self.eps).sqrt());

        let x_hat = &x_centered * &std_inv;
        let y = &x_hat * gamma + beta;

        // backward에서 재사용할 값 저장
        *self.x_hat.borrow_mut() = x_hat;
        *self.std_inv.borrow_mut() = std_inv;
        vec![y]
    }
    // backward: gx, ggamma, gbeta 계산
    fn name(&self) -> &str { "LayerNorm" }
}`,
    annotations: [
      { lines: [3, 4], color: 'sky', note: 'RefCell로 forward 결과 저장 → backward에서 재계산 없이 재사용' },
      { lines: [14, 18], color: 'emerald', note: 'last axis(feature) 기준 정규화 — 배치 크기와 무관. Transformer 표준' },
      { lines: [20, 21], color: 'amber', note: 'gamma(스케일) * 정규화값 + beta(시프트) — 정규화 후 표현력 복원' },
    ],
  },
  'layer-norm-struct': {
    path: 'src/lib.rs — LayerNorm 레이어',
    lang: 'rust',
    highlight: [1, 14],
    desc: 'LayerNorm 레이어: gamma=1, beta=0으로 초기화.\n정규화된 값을 처음에는 그대로 통과 → 학습으로 최적 스케일/시프트 습득.',
    code: `pub struct LayerNorm {
    gamma: Variable,  // 스케일 파라미터 (초기값: 1)
    beta: Variable,   // 시프트 파라미터 (초기값: 0)
    eps: f64,
}

impl LayerNorm {
    pub fn new(d: usize) -> Self {
        LayerNorm {
            gamma: Variable::new(ArrayD::ones(IxDyn(&[d]))),
            beta: Variable::new(ArrayD::zeros(IxDyn(&[d]))),
            eps: 1e-5,
        }
    }
}`,
    annotations: [
      { lines: [2, 3], color: 'sky', note: 'gamma=1, beta=0 → 초기에는 정규화된 값이 그대로 통과 (항등 변환)' },
      { lines: [12, 12], color: 'emerald', note: 'eps=1e-5로 0 나누기 방지 — 분산이 극히 작은 경우에도 수치 안정' },
    ],
  },
};
