export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'Xavier 초기화 — 층마다 분산 유지',
    body: 'scale=sqrt(1/in_size)로 입력 뉴런 수에 비례해 가중치를 줄여 출력 분산 안정화',
  },
  {
    label: 'Box-Muller 변환 — 균등분포 → 정규분포',
    body: 'LCG 균등분포 2개로 정규분포 난수 생성, 외부 RNG 의존 없음',
  },
  {
    label: 'forward: y = x @ W + b',
    body: 'matmul(x,W)+b를 Variable 연산으로 수행, 역전파 자동 추적',
  },
  {
    label: 'backward: gx = gy @ W^T, gw = x^T @ gy',
    body: '행렬 전치로 forward 방향을 뒤집어 gx(전파용)와 gw(업데이트용) 계산',
  },
];

export const STEP_REFS = ['linear-struct', 'linear-struct', 'matmul-fn', 'matmul-fn'];
export const STEP_LABELS = ['lib.rs — Xavier init', 'lib.rs — Box-Muller', 'lib.rs — linear forward', 'lib.rs — MatMulFn backward'];
