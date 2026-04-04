export const C = {
  g1: '#6366f1', g2: '#10b981', ml: '#f59e0b',
  ln: '#8b5cf6', ez: '#ec4899', hd: '#ef4444', gt: '#0ea5e9',
};

export const BODIES = [
  'G1의 점 P(Fp 좌표)와 G2의 점 Q(Fp2 좌표)를 입력받습니다.',
  '|6u+2| NAF 표현(65-bit)을 MSB부터 순회. f=1로 초기화.',
  '매 비트: 접선(doubling) 평가. 비영 비트: 할선(addition) 추가. Sparse Fp12 곱셈.',
  'f^(p⁶-1)(p²+1). Frobenius + conjugate + inv. 저비용 부분군 사영.',
  'f^((p⁴-p²+1)/r). 761-bit 지수. 결과 e(P,Q) ∈ GT. 쌍선형성 보장.',
];

export const STEPS = [
  { label: '입력: P ∈ G1, Q ∈ G2' },
  { label: 'Miller Loop 시작' },
  { label: 'Line 함수 평가' },
  { label: 'Easy Part' },
  { label: 'Hard Part → GT' },
];

export const NODES = [
  { id: 'P', c: C.g1, x: 10, y: 18, w: 38, h: 24 },
  { id: 'Q', c: C.g2, x: 10, y: 52, w: 38, h: 24 },
  { id: 'Miller', c: C.ml, x: 70, y: 28, w: 55, h: 28 },
  { id: 'Line', c: C.ln, x: 145, y: 28, w: 48, h: 28 },
  { id: 'Easy', c: C.ez, x: 215, y: 28, w: 48, h: 28 },
  { id: 'Hard', c: C.hd, x: 280, y: 28, w: 48, h: 28 },
  { id: 'GT', c: C.gt, x: 340, y: 28, w: 38, h: 28 },
];

export const PIPELINE_ARROWS = [
  { s: 2, x1: 127, x2: 143, c: C.ln },
  { s: 3, x1: 195, x2: 213, c: C.ez },
  { s: 4, x1: 265, x2: 278, c: C.hd },
  { s: 4, x1: 330, x2: 338, c: C.gt },
];

export const TOP_LABELS = [
  { s: 1, x: 97, c: C.ml, t: '65-bit NAF' },
  { s: 2, x: 169, c: C.ln, t: '접선/할선' },
  { s: 3, x: 239, c: C.ez, t: 'Frobenius' },
];
