export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'MSE: sum((y - t)²) / n — 기존 연산 조합',
    body: '기존 연산(sub→pow→sum→div) 조합으로 구성, backward 자동 추적',
  },
  {
    label: 'Softmax Cross-Entropy — 전용 Function',
    body: 'softmax+CE를 하나로 합쳐 exp overflow를 max 빼기로 안정화',
  },
  {
    label: 'log-sum-exp trick — 수치 안정성',
    body: '각 행에서 max를 빼서 exp overflow 방지, softmax 결과는 동일',
  },
  {
    label: '학습 루프: forward → loss → backward → update',
    body: 'forward→loss→backward→update→cleargrads 5단계 반복',
  },
];

export const STEP_REFS = ['loss-fn', 'loss-fn', 'loss-fn', 'loss-fn'];
export const STEP_LABELS = ['lib.rs — MSE', 'lib.rs — SoftmaxCE forward', 'lib.rs — log-sum-exp', 'lib.rs — training loop'];
