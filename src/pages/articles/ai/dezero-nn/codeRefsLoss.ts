import type { CodeRef } from '@/components/code/types';

export const lossCodeRefs: Record<string, CodeRef> = {
  'loss-fn': {
    path: 'src/lib.rs — MSE + Softmax Cross-Entropy',
    lang: 'rust',
    highlight: [1, 42],
    desc: 'MSE는 기존 연산 조합 → 역전파 자동.\nSoftmax CE는 수치 안정성 위해 전용 Function으로 구현.',
    code: `/// MSE: 기존 연산(sub, pow, sum, div) 조합
/// 역전파가 자동으로 따라옴 — 별도 backward 불필요
pub fn mean_squared_error(x0: &Variable, x1: &Variable) -> Variable {
    let diff = x0 - x1;
    let n = diff.len();
    &sum(&diff.pow(2.0)) / (n as f64)
}

/// Softmax Cross-Entropy: 전용 Function으로 구현
struct SoftmaxCrossEntropyFn { t: Vec<usize> }

impl Function for SoftmaxCrossEntropyFn {
    fn forward(&self, xs: &[ArrayD<f64>]) -> Vec<ArrayD<f64>> {
        let x = &xs[0]; // (N, C)
        let n = x.shape()[0];
        // 수치 안정: 각 행에서 max를 빼서 overflow 방지
        // exp(100) → overflow, exp(100-100) = 1
        for i in 0..n {
            let max_val = row_max(x, i);
            for j in 0..c {
                softmax[[i,j]] = (x[[i,j]] - max_val).exp();
            }
            normalize_row(&mut softmax, i);
        }
        // cross-entropy: -mean(log(p[i, t[i]]))
        let loss = -(0..n).map(|i|
            softmax[[i, self.t[i]]].max(1e-15).ln()
        ).sum::<f64>() / n as f64;
        vec![arr0(loss).into_dyn()]
    }

    fn backward(&self, xs: &[Variable], gys: &[Variable]) -> Vec<Variable> {
        // gradient: (softmax - one_hot) / N
        // 정답 클래스 위치에서만 1을 빼는 것이 one_hot 역할
        for i in 0..n {
            softmax[[i, self.t[i]]] -= 1.0;
        }
        let gx = softmax.mapv(|v| v / n as f64);
        let gy_val = gys[0].data().iter().next().unwrap_or(1.0);
        vec![Variable::new(gx.mapv(|v| v * gy_val))]
    }
}`,
    annotations: [
      { lines: [1, 6], color: 'sky', note: 'MSE: sub→pow→sum→div 조합 — 자동 미분이 역전파 처리' },
      { lines: [16, 17], color: 'emerald', note: 'log-sum-exp trick: max 빼기로 exp overflow 방지' },
      { lines: [33, 37], color: 'amber', note: 'backward: softmax - one_hot 공식 — 간결하고 수치 안정적' },
    ],
  },
};
