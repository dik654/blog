export function miniECDF(ox: number, oy: number) {
  const pts = [0, 0.05, 0.1, 0.2, 0.35, 0.55, 0.75, 0.9, 0.95, 1];
  return 'M' + pts.map((v, i) => `${ox + i * 6.5},${oy + 36 - v * 36}`).join(' L');
}

export const DIMS = [
  { label: 'Dim 1', ox: 10, oy: 25, color: '#3b82f6' },
  { label: 'Dim 2', ox: 85, oy: 25, color: '#10b981' },
  { label: 'Dim 3', ox: 160, oy: 25, color: '#f59e0b' },
];

export const TAILS = [
  { left: 0.9, right: 0.3 },
  { left: 0.2, right: 0.85 },
  { left: 0.7, right: 0.6 },
];

export const sp = { duration: 0.4, ease: 'easeOut' as const };

export const STEPS = [
  { label: '입력 데이터', body: '다변량 데이터 X ∈ R^{n×d}를 입력받습니다.' },
  { label: '차원별 ECDF 계산', body: '각 차원 j에 대해 경험적 누적분포함수 F_j(x)를 계산합니다.' },
  { label: '꼬리 확률 추출', body: '좌측 꼬리 F_j(x), 우측 꼬리 1-F_j(x)를 추출하고 -log로 변환합니다.' },
  { label: '이상치 점수 합산', body: '모든 차원의 점수를 합산: O(x) = Σ max(-log F_j, -log(1-F_j))' },
  { label: '임계값 판정', body: '점수가 임계값을 초과하면 이상치로 분류합니다.' },
];
