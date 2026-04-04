export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'Sigmoid: σ(x) = 1/(1+exp(-x))',
    body: '출력 (0,1), backward는 σ(x)·(1-σ(x))로 순전파 결과 재활용',
  },
  {
    label: 'Tanh: (e^x - e^(-x)) / (e^x + e^(-x))',
    body: '출력 (-1,1)로 평균 0 근처, RNN/LSTM의 기본 활성화 함수',
  },
  {
    label: 'GELU: 0.5·x·(1 + tanh(√(2/π)·(x + 0.044715·x³)))',
    body: 'erf 대신 tanh 다항식 근사, Transformer FFN의 표준 활성화',
  },
  {
    label: 'Function trait 통합 — forward/backward 쌍',
    body: 'Function trait 구현 후 Func::new().call()로 자동 미분 그래프에 편입',
  },
];

export const STEP_REFS = ['activation-fn', 'activation-fn', 'activation-fn', 'activation-fn'];
export const STEP_LABELS = ['lib.rs — SigmoidFn', 'lib.rs — TanhFn', 'lib.rs — GELUFn', 'lib.rs — Function trait'];
