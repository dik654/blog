import type { CodeRef } from '@/components/code/types';

export const optimizerCodeRefs: Record<string, CodeRef> = {
  'sgd': {
    path: 'src/lib.rs — SGD optimizer',
    lang: 'rust',
    highlight: [1, 22],
    desc: 'SGD 옵티마이저: p -= lr * grad.\nModel trait 참조로 모든 파라미터를 자동 순회.',
    code: `pub struct SGD<'a> {
    lr: f64,
    target: Option<&'a dyn Model>,
}

impl<'a> SGD<'a> {
    pub fn new(lr: f64) -> Self {
        SGD { lr, target: None }
    }

    /// 모델과 연결
    pub fn setup(mut self, model: &'a dyn Model) -> Self {
        self.target = Some(model);
        self
    }

    /// 모든 파라미터를 SGD 규칙으로 업데이트
    pub fn update(&self) {
        let model = self.target.expect("call setup()");
        for p in model.params() {
            let grad = p.grad().unwrap();
            p.set_data(&p.data() - &grad.mapv(|v| v * self.lr));
        }
    }
}`,
    annotations: [
      { lines: [3, 3], color: 'sky', note: '&dyn Model — trait object로 어떤 모델이든 수용' },
      { lines: [18, 23], color: 'emerald', note: 'update: model.params() 순회 → p -= lr * grad' },
    ],
  },
  'adam': {
    path: 'src/lib.rs — Adam optimizer',
    lang: 'rust',
    highlight: [1, 38],
    desc: 'Adam: 1차 모멘트(m) + 2차 모멘트(v) + 바이어스 보정.\n파라미터별 적응적 학습률.',
    code: `pub struct Adam {
    lr: f64,
    beta1: f64,   // 1차 모멘트 감쇠율 (기본 0.9)
    beta2: f64,   // 2차 모멘트 감쇠율 (기본 0.999)
    eps: f64,     // 0 나누기 방지 (1e-8)
    ms: RefCell<Vec<ArrayD<f64>>>,  // 1차 모멘트
    vs: RefCell<Vec<ArrayD<f64>>>,  // 2차 모멘트
    t: Cell<u32>,                   // 타임스텝
}

impl Adam {
    pub fn update(&self, params: &[Variable]) {
        self.t.set(self.t.get() + 1);
        let t = self.t.get() as f64;
        // 바이어스 보정: 초기 모멘트가 0이라 편향 발생
        let fix1 = 1.0 - self.beta1.powf(t);
        let fix2 = 1.0 - self.beta2.powf(t);
        let lr_t = self.lr * fix2.sqrt() / fix1;

        for (i, p) in params.iter().enumerate() {
            if let Some(grad) = p.grad() {
                // m ← β₁·m + (1-β₁)·grad
                ms[i] = &ms[i] * self.beta1
                    + &grad * (1.0 - self.beta1);
                // v ← β₂·v + (1-β₂)·grad²
                vs[i] = &vs[i] * self.beta2
                    + &(&grad * &grad) * (1.0 - self.beta2);
                // p ← p - lr_t · m / (√v + ε)
                let update = ms[i].mapv(|m| m * lr_t)
                    / vs[i].mapv(|v| v.sqrt() + self.eps);
                p.set_data(&p.data() - &update);
            }
        }
    }
}

// AdamW: 가중치 감쇠를 분리
// p ← p - lr_t * m/(√v+ε) - lr * wd * p
let wd_update = p.data().mapv(|w| w * self.lr * self.weight_decay);
p.set_data(&(&p.data() - &adam_update) - &wd_update);`,
    annotations: [
      { lines: [6, 8], color: 'sky', note: 'ms, vs — 파라미터별 모멘트를 Vec으로 관리. lazy init (첫 update 시 shape 결정)' },
      { lines: [15, 18], color: 'emerald', note: '바이어스 보정: t가 작을 때 m, v가 0 편향 → lr_t로 보정' },
      { lines: [22, 27], color: 'amber', note: '1차 모멘트(방향) + 2차 모멘트(크기) 이동평균 갱신' },
      { lines: [37, 39], color: 'violet', note: 'AdamW: wd 항을 모멘트 밖에서 분리 적용 → 정확한 감쇠' },
    ],
  },
};
