/* 실제 수치 예시: 4차원 벡터 하나에 LayerNorm 적용 */
export const INPUT = [2.0, -1.0, 0.5, 1.5];
export const MEAN = INPUT.reduce((a, b) => a + b, 0) / INPUT.length; // 0.75
export const VARIANCE = INPUT.reduce((a, b) => a + (b - MEAN) ** 2, 0) / INPUT.length;
const EPS = 1e-5;
export const NORMED = INPUT.map(v => (v - MEAN) / Math.sqrt(VARIANCE + EPS));
export const GAMMA = [1.0, 1.0, 1.0, 1.0];
export const BETA = [0.0, 0.0, 0.0, 0.0];
export const OUTPUT = NORMED.map((v, i) => GAMMA[i] * v + BETA[i]);

export const COLORS = {
  input: '#6366f1', stat: '#0ea5e9', norm: '#10b981', out: '#f59e0b',
};

export const STEPS = [
  { label: '입력 벡터 (d_model 차원)' },
  { label: '평균, 분산 계산' },
  { label: '정규화: (x - mean) / sqrt(var)' },
  { label: 'gamma * x + beta (스케일/시프트)' },
];
