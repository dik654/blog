export const STEPS = [
  { label: '업데이트 공식: θ_new = θ_old − η × ∇L' },
  { label: '1회: m₂ = 0 − 0.1×(−2.14) = 0.214 (기울기 크다 → 큰 이동)' },
  { label: '10회: m₂=1.48, 기울기 −0.62 (오차 줄며 기울기도 감소)' },
  { label: '40회: m₂=2.21, 기울기 −0.08 (거의 수렴)' },
  { label: '80회: m₂=2.35, 기울기 ≈0 (정답 도달!)' },
];

export const SNAPSHOTS = [
  { m2: 0, grad: -2.14, pred: [0.91, 0.09, 0.0], epoch: 0 },
  { m2: 0.214, grad: -1.85, pred: [0.85, 0.12, 0.03], epoch: 1 },
  { m2: 1.48, grad: -0.62, pred: [0.45, 0.42, 0.13], epoch: 10 },
  { m2: 2.21, grad: -0.08, pred: [0.08, 0.86, 0.06], epoch: 40 },
  { m2: 2.35, grad: 0.0, pred: [0.02, 0.95, 0.03], epoch: 80 },
];

export const CITIES = [
  { name: '마드리드', color: '#ef4444' },
  { name: '파리', color: '#3b82f6' },
  { name: '베를린', color: '#10b981' },
];
