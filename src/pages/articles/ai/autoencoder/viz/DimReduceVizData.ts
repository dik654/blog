export const STEPS = [
  {
    label: '① 고차원 데이터: 클래스별 분포',
    body: '3개 클래스(빨강/파랑/초록)의 고차원 데이터 포인트. 서로 겹쳐 있어 구분이 어려움.',
  },
  {
    label: '② 오토인코더 잠재 공간: 클러스터 형성',
    body: '비선형 압축 후 잠재 공간에서는 같은 클래스 데이터가 자연스럽게 모임.',
  },
  {
    label: '③ PCA vs 오토인코더: 선형 vs 비선형',
    body: 'PCA는 직선 투영, 오토인코더는 곡선 매니폴드 위로 투영. 비선형 구조 포착 가능.',
  },
];

// Scatter data: class, x(high-dim), y(high-dim), x(latent), y(latent)
export const POINTS = [
  // Class A (red)
  { cls: 0, hx: 40, hy: 60, lx: 55, ly: 30 },
  { cls: 0, hx: 55, hy: 50, lx: 60, ly: 25 },
  { cls: 0, hx: 35, hy: 70, lx: 50, ly: 35 },
  { cls: 0, hx: 50, hy: 55, lx: 58, ly: 28 },
  { cls: 0, hx: 45, hy: 65, lx: 53, ly: 32 },
  // Class B (blue)
  { cls: 1, hx: 100, hy: 40, lx: 140, ly: 30 },
  { cls: 1, hx: 110, hy: 55, lx: 145, ly: 25 },
  { cls: 1, hx: 95, hy: 50, lx: 135, ly: 35 },
  { cls: 1, hx: 105, hy: 60, lx: 142, ly: 28 },
  { cls: 1, hx: 115, hy: 45, lx: 148, ly: 32 },
  // Class C (green)
  { cls: 2, hx: 70, hy: 80, lx: 100, ly: 72 },
  { cls: 2, hx: 80, hy: 75, lx: 95, ly: 68 },
  { cls: 2, hx: 65, hy: 82, lx: 105, ly: 74 },
  { cls: 2, hx: 75, hy: 85, lx: 98, ly: 76 },
  { cls: 2, hx: 85, hy: 72, lx: 102, ly: 70 },
];

export const COLORS = ['#ef4444', '#3b82f6', '#10b981'];
