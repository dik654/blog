import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'SMOTE — 소수 클래스 사이에 합성 샘플 생성',
    body: 'Synthetic Minority Over-sampling Technique\n소수 클래스 샘플 x와 k-최근접 이웃 x̂ 사이를 선형 보간\nx_new = x + rand(0,1) × (x̂ - x) — 기존 데이터 "근처"에 새 점 생성',
  },
  {
    label: '가우시안 노이즈 주입 — 미세한 변동 추가',
    body: 'x_aug = x + ε, ε ~ N(0, σ²). σ는 각 피처 표준편차의 1~5%\n연속형 피처에만 적용 — 범주형에 노이즈를 넣으면 의미 파괴\n정규화/스케일링 이후에 적용해야 피처 간 노이즈 비율이 균일',
  },
  {
    label: 'Feature-wise Shuffling — 피처 독립성 파괴로 학습',
    body: '특정 피처의 값을 행 단위로 셔플 — 해당 피처와 타겟의 관계 끊기\n모델이 나머지 피처로 예측하도록 강제 → 앙상블에서 다양성 확보\nDropout의 테이블 버전이라고 볼 수 있다',
  },
  {
    label: 'Tabular Mixup — 테이블형 데이터에 Mixup 적용',
    body: '두 행을 λ 비율로 혼합: x̃ = λ·row₁ + (1-λ)·row₂\n범주형 피처: 확률적으로 하나를 선택 (보간 불가)\n회귀 타겟은 연속 혼합, 분류 타겟은 soft label로 처리',
  },
];

export const COLORS = {
  minority: '#ef4444',
  majority: '#3b82f6',
  synthetic: '#10b981',
  noise: '#f59e0b',
  shuffle: '#8b5cf6',
};
