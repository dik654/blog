export const R = '#ef4444', B = '#3b82f6', G = '#10b981', Y = '#f59e0b', P = '#a855f7';

export const STEPS = [
  { label: '핵심 질문: "모든 점에서 0인 다항식"',
    body: '각 점마다 (x − ωᵢ) 인수를 곱하면 된다.' },
  { label: 'Z_H(x) 구성: 인수를 하나씩 곱한다',
    body: '세 인수를 곱하면 세 점 모두에서 0이 되는 다항식 완성.' },
  { label: '검증: Z_H(x) = x(x−1)(x−2)',
    body: '도메인 내 0, 도메인 밖 ≠ 0 — Z_H(3) = 6.' },
  { label: '핵심 성질: 나누어떨어짐 ⟺ 모든 점에서 0',
    body: 'C(x)가 H의 모든 점에서 0 ↔ C(x) = Q(x)·Z_H(x).' },
  { label: 'ZKP 핵심 트릭: "점마다 검사" → "한 번 나눗셈"',
    body: 'C(x)/Z_H(x) 나머지 없이 나뉘는지만 확인 — PLONK·Groth16·STARK 공통.' },
];

export const FACTOR_COLORS = [R, B, G];
export const FACTORS = ['(x-0)', '(x-1)', '(x-2)'];
export const DOMAIN = [0, 1, 2];
