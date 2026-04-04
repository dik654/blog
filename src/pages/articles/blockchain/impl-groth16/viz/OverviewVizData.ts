export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'R1CS: 모든 계산을 "곱셈 하나" 형태로 분해',
    body: '⟨A,s⟩·⟨B,s⟩=⟨C,s⟩ 형태, 곱셈 하나 = 제약 하나 — 덧셈은 선형결합 내 무료',
  },
  {
    label: 'Variable 세 종류 — witness 벡터에서의 위치',
    body: 'One(상수항), Instance(공개 입력), Witness(비공개 입력) — 세 종류의 변수',
  },
  {
    label: 'Lagrange 보간 — R1CS 행렬 열을 다항식으로',
    body: 'R1CS 행렬 열을 Lagrange 보간 → 다항식 aⱼ(x) 변환 (교육용 O(n²))',
  },
  {
    label: 'QAP 동치: a(x)·b(x)-c(x) ≡ 0 mod t(x)',
    body: 'h(x)=(a·b-c)/t(x)가 다항식이면 모든 제약 만족 — m개 등식을 하나로 압축',
  },
];

export const STEP_REFS = [
  'r1cs-enforce', 'r1cs-types', 'qap-convert', 'qap-compute-h',
];
export const STEP_LABELS = [
  'r1cs.rs — enforce()', 'r1cs.rs — Variable enum', 'qap.rs — QAP::from_r1cs()', 'qap.rs — compute_h()',
];
