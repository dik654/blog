export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'h(x) = (a·b - c) / t(x) — QAP 만족 확인',
    body: 'witness로 a·b-c를 t(x)로 나눔 — 나머지=0이면 QAP 만족, 아니면 증명 불가',
  },
  {
    label: 'A = [α]₁ + Σwⱼ[aⱼ(τ)]₁ + r[δ]₁',
    body: '[α]₁(지식계수) + Σwⱼ[aⱼ(τ)]₁(MSM) + r[δ]₁(블라인딩)으로 A 생성',
  },
  {
    label: 'B = [β]₂ + Σwⱼ[bⱼ(τ)]₂ + s[δ]₂',
    body: 'G2 위에서 e(A,B) 검증용으로 계산, B\'(G1)도 C 생성에 별도 필요',
  },
  {
    label: 'C = private기여 + h기여 + 블라인딩',
    body: '비공개 기여 + h(τ)·t(τ)/δ(QAP 증거) + 블라인딩 교차항으로 영지식성 보장',
  },
];

export const STEP_REFS = [
  'qap-compute-h', 'groth16-prove', 'groth16-prove', 'groth16-prove-c',
];
export const STEP_LABELS = [
  'qap.rs — compute_h()', 'groth16.rs — prove() → A', 'groth16.rs — prove() → B', 'groth16.rs — prove() → C',
];
