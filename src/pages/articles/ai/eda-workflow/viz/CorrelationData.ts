import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '상관 행렬 — 피처 간 선형 관계의 전체 지도',
    body: 'Pearson 상관계수: -1(완전 역상관) ~ 0(무관) ~ +1(완전 양상관)\n|r| > 0.7이면 강한 상관 → 다중공선성 후보',
  },
  {
    label: '타겟과의 상관 — 예측에 유용한 피처 1차 필터',
    body: '타겟과 |r| > 0.3인 피처를 우선 후보로 선정\n하지만 낮은 상관이 쓸모없다는 뜻은 아님 — 비선형 관계일 수 있다',
  },
  {
    label: '다중공선성 — 중복 정보를 가진 피처 쌍',
    body: '피처 A-B의 r=0.95 → 둘 다 넣으면 모델이 불안정\nVIF(Variance Inflation Factor) > 10이면 하나를 제거하거나 PCA',
  },
  {
    label: 'Spearman 상관 — 비선형 단조 관계까지 포착',
    body: 'Pearson은 직선만 잡고, Spearman은 순위 기반이라 단조 곡선도 탐지\nPearson ≈ 0인데 Spearman이 높으면 → 비선형 관계 존재',
  },
];

export const COLORS = {
  positive: '#ef4444',
  negative: '#3b82f6',
  neutral: '#94a3b8',
  target: '#10b981',
  warning: '#f59e0b',
};

/* 6×6 상관 행렬 — 가상의 창고 피처 */
export const FEATURES = ['주문량', '로봇수', '혼잡도', '배터리', '대기열', '타겟'];
export const CORR_MATRIX = [
  [1.00, 0.82, 0.45, -0.15, 0.60, 0.72],
  [0.82, 1.00, 0.30, -0.08, 0.35, 0.55],
  [0.45, 0.30, 1.00, -0.40, 0.70, 0.62],
  [-0.15, -0.08, -0.40, 1.00, -0.25, -0.30],
  [0.60, 0.35, 0.70, -0.25, 1.00, 0.50],
  [0.72, 0.55, 0.62, -0.30, 0.50, 1.00],
];
