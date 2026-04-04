import type { CodeRef } from '@/components/code/types';

export const rnnCodeRefs: Record<string, CodeRef> = {
  'rnn-struct': {
    path: 'src/lib.rs — RNN struct + forward',
    lang: 'rust',
    highlight: [1, 32],
    desc: 'Simple RNN: h = tanh(x@W_x + h_prev@W_h).\n은닉 상태 하나로 시퀀스를 처리하지만 긴 의존성에서 기울기 소실.',
    code: `pub struct RNN {
    x2h: Linear,          // 입력→은닉 변환 (bias 포함)
    w_h: RefCell<Option<Variable>>, // 은닉→은닉 가중치 (lazy)
    h: RefCell<Option<Variable>>,   // 현재 은닉 상태
    hidden_size: usize,
    rng_state: Cell<u64>,
}

impl RNN {
    pub fn reset_state(&self) {
        *self.h.borrow_mut() = None;
    }

    pub fn forward(&self, x: &Variable) -> Variable {
        // w_h lazy init: 첫 호출 시 Xavier 초기화
        if self.w_h.borrow().is_none() {
            let scale = (1.0 / self.hidden_size as f64).sqrt();
            // ... Xavier init (hidden_size × hidden_size)
            *self.w_h.borrow_mut() = Some(w);
        }

        let h_new = if self.h.borrow().is_none() {
            tanh(&self.x2h.forward(x))      // 첫 스텝
        } else {
            let h = self.h.borrow().clone().unwrap();
            let w_h = self.w_h.borrow().as_ref().unwrap().clone();
            tanh(&(&self.x2h.forward(x) + &matmul(&h, &w_h)))
        };
        *self.h.borrow_mut() = Some(h_new.clone());
        h_new
    }
}`,
    annotations: [
      { lines: [3, 4], color: 'sky', note: '은닉 상태가 단 1개 — 모든 시간 정보를 하나의 벡터에 압축' },
      { lines: [23, 28], color: 'emerald', note: 'tanh로 감싸는 단일 게이트 — 긴 시퀀스에서 기울기가 0에 수렴' },
    ],
  },
  'test-mode': {
    path: 'src/lib.rs — TRAINING flag & test_mode guard',
    lang: 'rust',
    highlight: [1, 18],
    desc: 'thread_local TRAINING 플래그로 학습/추론 모드 구분.\nRAII guard 패턴으로 스코프 종료 시 자동 복원.',
    code: `thread_local! {
    static TRAINING: Cell<bool> = const { Cell::new(true) };
}

pub struct TestModeGuard { prev: bool }

/// 추론(테스트) 모드로 전환하는 RAII 가드
/// let _guard = test_mode(); 형태로 사용
pub fn test_mode() -> TestModeGuard {
    let prev = TRAINING.with(|c| c.get());
    TRAINING.with(|c| c.set(false));
    TestModeGuard { prev }
}

impl Drop for TestModeGuard {
    fn drop(&mut self) {
        TRAINING.with(|c| c.set(self.prev));
    }
}`,
    annotations: [
      { lines: [1, 3], color: 'sky', note: 'thread_local! — 스레드별 독립 상태. 멀티스레드에서도 안전' },
      { lines: [15, 18], color: 'emerald', note: 'Drop trait으로 스코프 종료 시 자동 복원 — Python의 with 문과 동일 효과' },
    ],
  },
};
