export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'LayerNorm — feature 축 정규화',
    body: 'last axis에서 mean,var 계산 후 정규화, 배치 크기 무관',
  },
  {
    label: 'gamma(스케일) + beta(시프트)',
    body: 'gamma=1, beta=0에서 시작하여 학습으로 최적 스케일/시프트 습득',
  },
  {
    label: 'backward — 3개 기울기 동시 계산',
    body: 'gbeta, ggamma, gx 3개 기울기를 동시 계산하여 역전파',
  },
  {
    label: 'RefCell로 중간값 저장',
    body: 'x_hat, std_inv를 RefCell에 캐시하여 backward에서 재계산 방지',
  },
];

export const STEP_REFS = ['layer-norm-fn', 'layer-norm-struct', 'layer-norm-fn', 'layer-norm-fn'];
export const STEP_LABELS = ['lib.rs — LayerNormFn forward', 'lib.rs — LayerNorm struct', 'lib.rs — backward', 'lib.rs — RefCell 캐시'];
