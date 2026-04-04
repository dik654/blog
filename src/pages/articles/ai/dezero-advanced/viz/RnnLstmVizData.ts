export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'RNN 구조 — 단일 tanh 게이트',
    body: '단일 tanh 게이트로 모든 시간 정보를 h에 압축, 기울기 감소 문제 발생',
  },
  {
    label: 'LSTM 구조 — 셀 상태 + 4 게이트',
    body: '셀 상태 c가 덧셈 경로로 직접 전달되어 100+ 스텝도 기울기 전파 가능',
  },
  {
    label: 'Rust 구현: RefCell<Option<Variable>>',
    body: 'h,c를 RefCell<Option>으로 관리, reset_state()로 시퀀스 경계 초기화',
  },
  {
    label: '파라미터 비교: RNN 1개 vs LSTM 4개',
    body: 'LSTM은 RNN 대비 W_h 4개로 4배 파라미터, 4배 표현력+연산',
  },
];

export const STEP_REFS = ['rnn-struct', 'lstm-struct', 'lstm-forward', 'lstm-struct'];
export const STEP_LABELS = ['lib.rs — RNN forward', 'lib.rs — LSTM cell', 'lib.rs — LSTM forward', 'lib.rs — params 비교'];
