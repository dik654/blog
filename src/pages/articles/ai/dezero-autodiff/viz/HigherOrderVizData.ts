export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'y = x⁴ - 2x² (x=2.0) → 순전파',
    body: 'PowFn, MulFn, SubFn이 계산 그래프를 구성하여 y=8 산출',
  },
  {
    label: '1차 역전파: dy/dx (create_graph=true)',
    body: 'create_graph=true로 역전파 자체도 그래프에 기록, dy/dx=24',
  },
  {
    label: 'x.grad의 creator 체인 — 2차 미분 준비',
    body: 'x.grad가 Variable이라 creator 체인이 남아 2차 미분 준비 완료',
  },
  {
    label: '2차 역전파: d²y/dx² = 12x² - 4 = 44',
    body: 'gx.backward()로 d²y/dx²=44 산출, Newton법에 활용 가능',
  },
];

export const STEP_REFS = ['backward', 'backward', 'var-struct', 'no-grad'];
export const STEP_LABELS = ['lib.rs — forward chain', 'lib.rs — create_graph=true', 'lib.rs — grad Variable', 'lib.rs — double backprop'];
