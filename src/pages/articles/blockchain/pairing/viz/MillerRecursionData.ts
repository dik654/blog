export const DB = '#6366f1';
export const AD = '#10b981';
export const VT = '#f59e0b';
export const TW = '#8b5cf6';

export const BITS = [1, 0, 0, 1, 0, 1, 1, 0];

export const BODIES = [
  '|6u+2|의 NAF 표현을 MSB부터 순회. 각 비트마다 doubling, 비영 비트에서 addition.',
  'f = f² · l_tangent(P). [i]Q에서의 접선을 P에서 평가. 매 비트 실행.',
  'f = f · l_chord(P). Q와 [i]Q를 잇는 직선을 P에서 평가. 비트=±1일 때만.',
  'Sextic twist로 G2를 Fp2로 표현. 수직선은 Final Exp에서 자동 소거.',
];

export const STEPS = [
  { label: 'Miller Loop: 비트 순회 구조' },
  { label: 'Doubling: f² × 접선 평가' },
  { label: 'Addition: f × 할선 평가' },
  { label: 'Twist + 수직선 소거' },
];
