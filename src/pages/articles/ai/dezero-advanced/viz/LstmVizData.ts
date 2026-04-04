export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'Step 1: 4개 게이트 계산',
    body: 'x와 h_prev를 4개 독립 게이트(f, i, g, o)에 통과시켜 각각의 제어 신호 생성',
  },
  {
    label: 'Step 2: 셀 상태 업데이트 (c)',
    body: 'c_new = f*c_prev + i*g — 덧셈 경로라 기울기가 그대로 전달(소실 방지)',
  },
  {
    label: 'Step 3: 은닉 상태 출력 (h)',
    body: 'h_new = o * tanh(c_new) — o gate가 셀 상태 중 외부로 보낼 정보를 선택',
  },
  {
    label: '첫 스텝 vs 이후 스텝',
    body: '첫 스텝은 h=None이라 forget 없이 시작, 이후부터 전체 게이트 활성화',
  },
];

export const STEP_REFS = ['lstm-forward', 'lstm-forward', 'lstm-forward', 'lstm-struct'];
export const STEP_LABELS = ['lib.rs — 4 gates', 'lib.rs — cell state', 'lib.rs — hidden state', 'lib.rs — Option 분기'];
