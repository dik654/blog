import type { CodeRef } from '@/components/code/types';

export const lstmCodeRefs: Record<string, CodeRef> = {
  'lstm-struct': {
    path: 'src/lib.rs — LSTM struct',
    lang: 'rust',
    highlight: [1, 26],
    desc: 'LSTM 셀: 4개 게이트(f,i,o,g)와 2개 상태(h,c).\nRNN과 달리 셀 상태 c가 장기 기억을 보존.',
    code: `pub struct LSTM {
    // 입력 → 게이트 (bias 포함)
    x2f: Linear,  // forget gate
    x2i: Linear,  // input gate
    x2o: Linear,  // output gate
    x2g: Linear,  // candidate gate
    // 은닉 → 게이트 (bias 없음, lazy init)
    w_hf: RefCell<Option<Variable>>,
    w_hi: RefCell<Option<Variable>>,
    w_ho: RefCell<Option<Variable>>,
    w_hg: RefCell<Option<Variable>>,
    // 상태
    h: RefCell<Option<Variable>>,  // 은닉(단기 출력)
    c: RefCell<Option<Variable>>,  // 셀(장기 기억)
    hidden_size: usize,
    rng_state: Cell<u64>,
}

impl LSTM {
    pub fn reset_state(&self) {
        *self.h.borrow_mut() = None;
        *self.c.borrow_mut() = None;
    }
    // Xavier 초기화: (hidden_size, hidden_size) 가중치
    fn init_w_h(&self) -> Variable { /* ... */ }
}`,
    annotations: [
      { lines: [3, 6], color: 'sky', note: 'x→gate: Linear 4개. 각각 forget/input/output/candidate 역할' },
      { lines: [8, 11], color: 'emerald', note: 'h→gate: 은닉 상태를 게이트에 연결. lazy init으로 hidden_size 자동 감지' },
      { lines: [13, 14], color: 'amber', note: 'RNN(h만)과 달리 h + c 두 경로 — c가 장기 기억을 직접 전달' },
    ],
  },
  'lstm-forward': {
    path: 'src/lib.rs — LSTM forward',
    lang: 'rust',
    highlight: [1, 36],
    desc: '4개 게이트 계산 → 셀 상태 업데이트 → 은닉 상태 출력.\n첫 스텝에서는 h가 없으므로 x→gate만 사용.',
    code: `pub fn forward(&self, x: &Variable) -> Variable {
    // h→gate 가중치 lazy init
    if self.w_hf.borrow().is_none() {
        *self.w_hf.borrow_mut() = Some(self.init_w_h());
        *self.w_hi.borrow_mut() = Some(self.init_w_h());
        *self.w_ho.borrow_mut() = Some(self.init_w_h());
        *self.w_hg.borrow_mut() = Some(self.init_w_h());
    }

    // 4개 게이트 계산
    let (f, i, o, g) = if self.h.borrow().is_none() {
        (                                // 첫 스텝: x→gate만
            sigmoid(&self.x2f.forward(x)),
            sigmoid(&self.x2i.forward(x)),
            sigmoid(&self.x2o.forward(x)),
            tanh(&self.x2g.forward(x)),
        )
    } else {
        let h = self.h.borrow().clone().unwrap();
        (                                // 이후: x→gate + h→gate
            sigmoid(&(&self.x2f.forward(x) + &matmul(&h, &w_hf))),
            sigmoid(&(&self.x2i.forward(x) + &matmul(&h, &w_hi))),
            sigmoid(&(&self.x2o.forward(x) + &matmul(&h, &w_ho))),
            tanh(&(&self.x2g.forward(x) + &matmul(&h, &w_hg))),
        )
    };

    // 셀 상태 업데이트: c_new = f * c + i * g
    let c_new = if self.c.borrow().is_none() {
        &i * &g  // 첫 스텝: forget할 것 없음
    } else {
        let c = self.c.borrow().clone().unwrap();
        &(&f * &c) + &(&i * &g)
    };

    // 은닉 상태: h_new = o * tanh(c_new)
    let h_new = &o * &tanh(&c_new);
    *self.h.borrow_mut() = Some(h_new.clone());
    *self.c.borrow_mut() = Some(c_new);
    h_new
}`,
    annotations: [
      { lines: [11, 17], color: 'sky', note: '첫 스텝: h=None이므로 x→gate만 계산. sigmoid(0~1) / tanh(-1~1) 범위' },
      { lines: [28, 33], color: 'emerald', note: 'c = f*c_prev + i*g — forget이 기존 기억 비율, input이 새 정보 비율 결정' },
      { lines: [36, 36], color: 'amber', note: 'h = o * tanh(c) — output gate가 장기 기억에서 무엇을 출력할지 필터링' },
    ],
  },
};
