import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  low: '#3b82f6',
  mid: '#f59e0b',
  high: '#10b981',
  warmup: '#ec4899',
  cosine: '#8b5cf6',
  accent: '#06b6d4',
};

export const STEPS: StepDef[] = [
  {
    label: 'Discriminative Learning Rates — 레이어별 차등 학습률',
    body: '하위 레이어(범용 피처)는 낮은 LR(1e-5)로 미세 조정. 상위 레이어(태스크 특화)는 높은 LR(1e-3)로 빠르게 적응. 비율 약 10~100배 차이.',
  },
  {
    label: 'Warmup: 초기 학습률을 낮게 시작',
    body: '학습 초기에 큰 LR → pretrained 가중치가 크게 흔들림(Catastrophic Forgetting). Warmup: 0부터 target LR까지 서서히 증가 → 안정적 시작.',
  },
  {
    label: 'Cosine Annealing: 학습률을 코사인 곡선으로 감소',
    body: 'LR을 cos(t)에 따라 서서히 줄인다. 초반 빠른 학습 + 후반 미세 조정. Warm Restart 변형: 주기적으로 LR 복원 → local minima 탈출.',
  },
  {
    label: 'Warmup + Cosine 조합 — 실전 표준',
    body: '처음 5~10% epoch은 warmup으로 LR 상승. 이후 cosine decay로 천천히 감소. BERT/GPT fine-tuning의 기본 스케줄.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
