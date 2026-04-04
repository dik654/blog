export const NAF = [1, 0, 0, -1, 0, 1, 0, 0, -1, 0, 0, 1];
export const DB = '#6366f1';
export const AD = '#10b981';
export const CR = '#f59e0b';

export const BODIES = [
  '65-bit NAF 표현. 비영 비트는 약 1/3. +1이면 Q 더하기, -1이면 -Q 더하기.',
  'f = f² × l_double. 접선(tangent) 함수를 P에서 평가. Fp12 squaring + sparse mul.',
  'f = f × l_add. 할선(chord) 함수를 P에서 평가. NAF 덕에 addition 횟수 최소화.',
  '루프 종료 후 π(Q), π²(Q)로 2회 addition. Optimal Ate ↔ Tate 동치 보정.',
];

export const STEPS = [
  { label: 'NAF 비트 배열: |6u+2|' },
  { label: 'Doubling step (매 비트)' },
  { label: 'Addition step (비트 ±1)' },
  { label: 'BN 보정: Frobenius 추가' },
];
