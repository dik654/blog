import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Early Stopping 기본 원리: Val Loss 모니터링',
    body: '매 에폭마다 검증 손실을 추적. 최소값(best)을 갱신할 때마다 모델을 저장.',
  },
  {
    label: 'Patience: 연속 N 에폭 동안 개선 없으면 종료',
    body: 'patience=5 → 5번 연속 best를 넘지 못하면 학습 중단. 너무 작으면 조기 종료, 너무 크면 낭비.',
  },
  {
    label: 'Restore Best Weights: 최적 시점으로 복원',
    body: '종료 시점의 모델이 아니라 Val Loss가 최소였던 시점의 가중치를 복원. 핵심 기능.',
  },
  {
    label: 'Patience 설정 가이드: 데이터·스케줄러에 맞춰 조정',
    body: '큰 데이터 → patience 10~20. 작은 데이터 → 5~10. LR Scheduler와 함께 쓸 때 → patience를 넉넉히.',
  },
];

export const COLORS = {
  train: '#3b82f6',
  val: '#ef4444',
  best: '#10b981',
  patience: '#f59e0b',
  stop: '#8b5cf6',
};
