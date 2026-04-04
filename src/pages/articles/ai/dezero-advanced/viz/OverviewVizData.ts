export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'RNN의 한계 — 기울기 소실',
    body: '매 스텝 tanh 통과로 기울기가 0.x^n 감소, 장기 의존성 학습 불가',
  },
  {
    label: 'LSTM — 게이트로 기억 제어',
    body: '셀 상태 c를 덧셈으로 전달하여 100+ 스텝에서도 기울기 안정 전파',
  },
  {
    label: '정규화 — 내부 공변량 변화 제거',
    body: '각 샘플 내 feature 정규화로 출력 분포 안정화, Transformer 필수 요소',
  },
  {
    label: 'Dropout & Embedding — 일반화와 표현',
    body: 'Dropout으로 과적합 방지, Embedding으로 정수 ID→밀집 벡터 변환',
  },
];

export const STEP_REFS = ['rnn-struct', 'lstm-struct', 'layer-norm-fn', 'dropout-fn'];
export const STEP_LABELS = ['lib.rs — RNN struct', 'lib.rs — LSTM struct', 'lib.rs — LayerNormFn', 'lib.rs — DropoutFn'];
