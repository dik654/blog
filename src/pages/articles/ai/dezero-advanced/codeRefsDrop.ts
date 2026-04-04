import type { CodeRef } from '@/components/code/types';

export const dropCodeRefs: Record<string, CodeRef> = {
  'dropout-fn': {
    path: 'src/lib.rs — DropoutFn (inverted dropout)',
    lang: 'rust',
    highlight: [1, 30],
    desc: 'Inverted Dropout: 학습 시 1/(1-p) 스케일링.\n추론 시에는 연산 없이 그대로 통과.',
    code: `struct DropoutFn {
    dropout_ratio: f64,
    mask: RefCell<ArrayD<f64>>,  // backward용 마스크 저장
}

impl Function for DropoutFn {
    fn forward(&self, xs: &[ArrayD<f64>]) -> Vec<ArrayD<f64>> {
        let x = &xs[0];
        let scale = 1.0 / (1.0 - self.dropout_ratio);
        let mask = DROPOUT_RNG.with(|rng| {
            let mut state = rng.get();
            ArrayD::from_shape_fn(x.raw_dim(), |_| {
                state = state.wrapping_mul(6364136223846793005)
                    .wrapping_add(1442695040888963407);
                let r = (state >> 11) as f64 / (1u64 << 53) as f64;
                rng.set(state);
                if r > self.dropout_ratio { scale } else { 0.0 }
            })
        });
        let y = x * &mask;
        *self.mask.borrow_mut() = mask;
        vec![y]
    }

    fn backward(&self, _xs: &[Variable], gys: &[Variable]) -> Vec<Variable> {
        let mask = self.mask.borrow();
        vec![&gys[0] * &Variable::new(mask.clone())]
    }
}`,
    annotations: [
      { lines: [9, 9], color: 'sky', note: 'inverted dropout: 학습 시 1/(1-p)로 스케일 → 추론 시 별도 보정 불필요' },
      { lines: [18, 18], color: 'emerald', note: 'r > p면 scale, 아니면 0 → 확률 p로 뉴런 비활성화' },
      { lines: [27, 28], color: 'amber', note: 'backward: 같은 mask 적용 — 비활성화된 뉴런은 기울기도 0' },
    ],
  },
  'dropout-gate': {
    path: 'src/lib.rs — dropout 함수 (학습/추론 분기)',
    lang: 'rust',
    highlight: [1, 10],
    desc: 'TRAINING 플래그로 학습/추론 자동 분기.\n추론 모드에서는 x.clone()만 반환 (연산 0).',
    code: `pub fn dropout(x: &Variable, dropout_ratio: f64) -> Variable {
    if TRAINING.with(|c| c.get()) {
        Func::new(DropoutFn {
            dropout_ratio,
            mask: RefCell::new(ArrayD::zeros(IxDyn(&[]))),
        }).call(&[x])
    } else {
        x.clone()  // 추론: 그대로 통과
    }
}`,
    annotations: [
      { lines: [2, 2], color: 'sky', note: 'thread_local TRAINING 플래그 확인 — test_mode() guard로 제어' },
      { lines: [8, 8], color: 'emerald', note: '추론 시 x.clone() — 계산 그래프에 Dropout 노드를 추가하지 않음' },
    ],
  },
};
