import type { CodeRef } from '@/components/code/types';

export const opsCodeRefs: Record<string, CodeRef> = {
  'add-fn': {
    path: 'src/lib.rs — AddFn / MulFn',
    lang: 'rust',
    highlight: [1, 31],
    desc: '사칙연산의 forward/backward 쌍.\n역전파 규칙: Add는 그대로 전달, Mul은 교차 곱.',
    code: `struct AddFn;

impl Function for AddFn {
    fn forward(&self, xs: &[ArrayD<f64>]) -> Vec<ArrayD<f64>> {
        vec![&xs[0] + &xs[1]]
    }
    fn backward(&self, xs: &[Variable], gys: &[Variable])
        -> Vec<Variable> {
        // d(x+y)/dx = 1, d(x+y)/dy = 1
        // -> 그래디언트를 그대로 전달 (+ broadcast 보정)
        let gx0 = sum_to(&gys[0], &xs[0].shape());
        let gx1 = sum_to(&gys[0], &xs[1].shape());
        vec![gx0, gx1]
    }
}

struct MulFn;

impl Function for MulFn {
    fn forward(&self, xs: &[ArrayD<f64>]) -> Vec<ArrayD<f64>> {
        vec![&xs[0] * &xs[1]]
    }
    fn backward(&self, xs: &[Variable], gys: &[Variable])
        -> Vec<Variable> {
        // d(x*y)/dx = y, d(x*y)/dy = x
        // -> 교차 곱 후 broadcast 보정
        let gx0 = sum_to(&(&xs[1] * &gys[0]), &xs[0].shape());
        let gx1 = sum_to(&(&xs[0] * &gys[0]), &xs[1].shape());
        vec![gx0, gx1]
    }
}`,
    annotations: [
      { lines: [9, 12], color: 'sky', note: 'Add 역전파 — dy/dx = 1이므로 gy 그대로 전달' },
      { lines: [11, 12], color: 'emerald', note: 'sum_to — broadcast된 shape를 원래 shape로 축소' },
      { lines: [26, 29], color: 'amber', note: 'Mul 역전파 — dy/dx = y, dy/dy = x (교차 곱)' },
    ],
  },
};
