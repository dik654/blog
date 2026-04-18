import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '프루닝 후 fine-tuning: 정확도 복구의 핵심',
    body: '프루닝만으로는 정확도 하락 불가피 — fine-tuning으로 남은 가중치를 재조정.\n일반적으로 원래 학습 에폭의 10~30%만 추가 학습하면 복구 가능.',
  },
  {
    label: '학습률 설정: 원래의 1/10 ~ 1/100',
    body: '프루닝 후 가중치는 이미 좋은 위치 → 큰 LR은 발산 위험.\nCosine Annealing: peak LR = 원래의 1/10, warmup 비율 5%.\n너무 작으면 복구 부족, 너무 크면 남은 가중치도 망가짐.',
  },
  {
    label: 'Knowledge Distillation과 결합',
    body: 'Pruned 모델(Student)이 원본(Teacher)의 soft label로 학습.\nL = α·CE(y, ŷ) + (1-α)·KL(teacher_soft, student_soft)\nα=0.5, T=4가 일반적 시작점. Teacher의 "어두운 지식"이 복구를 가속.',
  },
  {
    label: '최적 경량화 순서: 프루닝 → fine-tuning → 양자화',
    body: '1) 프루닝: 불필요한 연결 제거 (구조 최적화)\n2) fine-tuning: 정확도 복구 (가중치 재조정)\n3) 양자화: 비트 수 축소 (메모리 최적화)\n순서 바꾸면 효과 반감 — 프루닝이 양자화 분포를 바꾸기 때문.',
  },
];

export const COLORS = {
  finetune: '#3b82f6',
  lr: '#f59e0b',
  distill: '#8b5cf6',
  pipeline: '#10b981',
  warning: '#ef4444',
};
