import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'MCAR — 완전 무작위 결측 (Missing Completely At Random)',
    body: '결측 발생이 어떤 변수와도 무관 — 센서 오작동, 네트워크 순단 등\n결측 비율이 낮으면 단순 제거(listwise deletion)도 가능',
  },
  {
    label: 'MAR — 조건부 무작위 결측 (Missing At Random)',
    body: '결측 발생이 관측된 다른 변수에 의존 — 예: 로봇 종류에 따라 특정 센서 없음\n조건을 만족하는 그룹 내에서는 무작위 → 다중 대입(Multiple Imputation) 적합',
  },
  {
    label: 'MNAR — 비무작위 결측 (Missing Not At Random)',
    body: '결측 자체가 정보를 담고 있음 — 예: 배터리가 낮을 때 센서 값이 결측\n결측 여부 자체를 이진 피처로 만들면 예측력이 올라간다',
  },
  {
    label: '결측 처리 전략 결정 트리',
    body: '1) 50%+ 결측 → 제거 (or 결측 이진 피처만 유지)\n2) MCAR → 중앙값/평균 대체\n3) MAR → KNN/Iterative 대체\n4) MNAR → 결측 이진 피처 생성 + 대체',
  },
];

export const COLORS = {
  present: '#10b981',
  missing: '#ef4444',
  mcar: '#3b82f6',
  mar: '#f59e0b',
  mnar: '#8b5cf6',
  strategy: '#6366f1',
};
