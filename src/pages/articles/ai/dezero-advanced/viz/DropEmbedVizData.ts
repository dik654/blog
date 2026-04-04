export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'Inverted Dropout — 학습 시 스케일링',
    body: '확률 p로 비활성화 후 1/(1-p) 스케일링, 추론 시 보정 불필요',
  },
  {
    label: 'TRAINING 플래그 — RAII guard 패턴',
    body: 'test_mode()로 TRAINING=false 설정, Drop trait이 스코프 종료 시 복원',
  },
  {
    label: 'Embedding — 정수 → 벡터 룩업',
    body: 'W[idx] 행 복사로 정수→벡터 변환, Xavier 초기화 적용',
  },
  {
    label: 'Embedding backward — scatter-add',
    body: 'gW[idx]에 gy를 scatter-add로 누적, 같은 인덱스는 기울기 합산',
  },
];

export const STEP_REFS = ['dropout-fn', 'dropout-gate', 'embedding-struct', 'embedding-fn'];
export const STEP_LABELS = ['lib.rs — DropoutFn', 'lib.rs — test_mode()', 'lib.rs — Embedding', 'lib.rs — EmbeddingFn backward'];
