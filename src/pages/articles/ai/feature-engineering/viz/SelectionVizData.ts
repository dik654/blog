import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  perm: '#6366f1',
  shap: '#10b981',
  boruta: '#f59e0b',
  corr: '#ec4899',
  rfe: '#3b82f6',
};

export const STEPS: StepDef[] = [
  {
    label: 'Permutation Importance: 셔플 기반 중요도',
    body: '피처 하나를 랜덤 셔플하고 성능 하락폭 측정. 모델에 구애받지 않는 범용 방법.',
  },
  {
    label: 'SHAP Values: 기여도 분해',
    body: '게임 이론 기반. 각 피처가 예측에 얼마나 기여했는지 양/음 방향으로 분해.',
  },
  {
    label: 'Boruta: 랜덤 포레스트 + 그림자 변수',
    body: '원본 피처를 셔플한 그림자(shadow) 변수를 만들고, 그림자보다 중요한 피처만 채택.',
  },
  {
    label: '상관 기반 제거: 다중공선성 처리',
    body: '피처 간 상관계수 > 0.95이면 중복. 하나를 제거해 차원 축소와 학습 안정성 확보.',
  },
  {
    label: 'RFE: 재귀적 피처 제거',
    body: '모델을 반복 학습하며 가장 덜 중요한 피처를 하나씩 제거. 최적 피처 부분집합 탐색.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
