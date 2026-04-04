/* d_model=4, d_ff=8 (4배 확장) — 토큰 1개의 FFN 처리 */
export const INPUT = [0.52, -0.31, 0.78, 0.15];
export const EXPANDED = [0.22, -0.15, 0.41, 0.67, -0.33, 0.58, 0.09, -0.44];
export const GELU_OUT = [0.17, -0.06, 0.34, 0.56, -0.11, 0.49, 0.05, -0.14];
export const OUTPUT = [0.38, -0.12, 0.54, 0.27];

export const C = {
  input: '#6366f1', expand: '#0ea5e9', gelu: '#10b981', out: '#f59e0b',
};

export const STEPS = [
  { label: '입력 (d_model=4)' },
  { label: 'W1: 4배 확장 → d_ff=8' },
  { label: 'GELU 비선형 활성화' },
  { label: 'W2: 복원 → d_model=4' },
];
