export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'Circuit trait — synthesize() 하나로 모든 역할',
    body: 'synthesize()가 변수+제약를 추가 — 같은 구현을 setup, prove, verify에서 재사용',
  },
  {
    label: 'alloc_instance + alloc_witness — 변수 할당',
    body: 'alloc_instance(공개)와 alloc_witness(비공개)로 변수 할당 — instance 먼저',
  },
  {
    label: 'x^3 + x + 5 = y — 제약 3개로 분해',
    body: '곱셈마다 보조 변수 도입 — t1=x*x, t2=t1*x, (t2+x+5)=y로 제약 3개',
  },
];

export const STEP_REFS = ['circuit-trait', 'r1cs-types', 'circuit-cubic'];
export const STEP_LABELS = ['r1cs.rs — Circuit trait', 'r1cs.rs — alloc 패턴', 'groth16.rs — CubicCircuit'];
