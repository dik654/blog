import type { CodeRef } from '@/components/code/types';

export const activationCodeRefs: Record<string, CodeRef> = {
  'activation-fn': {
    path: 'src/lib.rs — Sigmoid / Tanh / GELU',
    lang: 'rust',
    highlight: [1, 38],
    desc: '활성화 함수 구현.\n각 함수가 forward/backward 쌍으로 자동 미분 시스템에 통합.',
    code: `struct SigmoidFn;
impl Function for SigmoidFn {
    // σ(x) = 1 / (1 + exp(-x))
    fn forward(&self, xs: &[ArrayD<f64>]) -> Vec<ArrayD<f64>> {
        vec![xs[0].mapv(|x| 1.0 / (1.0 + (-x).exp()))]
    }
    // σ'(x) = σ(x) * (1 - σ(x))
    fn backward(&self, xs: &[Variable], gys: &[Variable]) -> Vec<Variable> {
        let y = sigmoid(&xs[0]);
        vec![&gys[0] * &(&y * &(1.0 - &y))]
    }
}

struct TanhFn;
impl Function for TanhFn {
    fn forward(&self, xs: &[ArrayD<f64>]) -> Vec<ArrayD<f64>> {
        vec![xs[0].mapv(f64::tanh)]
    }
    // tanh'(x) = 1 - tanh(x)²
    fn backward(&self, xs: &[Variable], gys: &[Variable]) -> Vec<Variable> {
        let y = tanh(&xs[0]);
        vec![&gys[0] * &(1.0 - &(&y * &y))]
    }
}

struct GELUFn;
impl Function for GELUFn {
    fn forward(&self, xs: &[ArrayD<f64>]) -> Vec<ArrayD<f64>> {
        let sqrt_2_pi = (2.0 / PI).sqrt();
        let y = xs[0].mapv(|v| {
            let u = sqrt_2_pi * (v + 0.044715 * v.powi(3));
            0.5 * v * (1.0 + u.tanh())
        });
        vec![y]
    }
    // GELU'(x) = 복합 미분 (chain rule 수동 적용)
    fn backward(&self, xs: &[Variable], gys: &[Variable]) -> Vec<Variable> {
        // ... sech²(u) * du/dx 전개
    }
}`,
    annotations: [
      { lines: [3, 5], color: 'sky', note: 'sigmoid: 출력이 (0, 1) 범위 — 확률 해석 가능' },
      { lines: [7, 10], color: 'emerald', note: 'sigmoid 미분: y*(1-y) — 순전파 출력 재활용' },
      { lines: [19, 22], color: 'amber', note: 'tanh 미분: 1-y² — sigmoid과 같은 패턴' },
      { lines: [29, 33], color: 'violet', note: 'GELU: 근사식 사용 — Transformer의 표준 활성화' },
    ],
  },
};
