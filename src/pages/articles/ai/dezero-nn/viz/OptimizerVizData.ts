export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'SGD: p ← p - lr × grad',
    body: 'params() 순회하며 각 p에서 lr*grad를 빼는 가장 단순한 규칙',
  },
  {
    label: 'Adam: 1차 모멘트(m) + 2차 모멘트(v)',
    body: 'm(방향 이동평균) + v(크기 이동평균)로 파라미터별 적응적 학습률',
  },
  {
    label: 'Adam: 바이어스 보정',
    body: '초기 m,v=0의 편향을 lr_t = lr×√(1-β₂ᵗ)/(1-β₁ᵗ)로 보정',
  },
  {
    label: 'AdamW: 가중치 감쇠를 분리',
    body: '가중치 감쇠를 모멘트 밖에서 별도 적용하여 의도한 강도 유지',
  },
];

export const STEP_REFS = ['sgd', 'adam', 'adam', 'adam'];
export const STEP_LABELS = ['lib.rs — SGD::update()', 'lib.rs — Adam moments', 'lib.rs — bias correction', 'lib.rs — AdamW'];
