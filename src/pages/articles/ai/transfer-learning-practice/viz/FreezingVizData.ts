import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  frozen: '#3b82f6',
  trainable: '#10b981',
  gradual: '#f59e0b',
  data: '#8b5cf6',
  warn: '#ef4444',
};

export const STEPS: StepDef[] = [
  {
    label: '레이어 동결이란? — 하위 레이어의 가중치를 고정',
    body: '하위 레이어(Conv1~3)는 에지·텍스처 같은 범용 피처를 이미 학습. 이를 그대로 재사용하고 상위만 학습하면 과적합 방지 + 학습 속도 향상.',
  },
  {
    label: 'Freeze 비율과 데이터량의 관계',
    body: '데이터 적을수록(< 1만) → 더 많이 freeze (과적합 방지). 데이터 많을수록 → 적게 freeze (더 많은 레이어 적응 가능).',
  },
  {
    label: 'Gradual Unfreezing — 마지막 레이어부터 순차 해동',
    body: 'ULMFiT(Howard 2018)이 제안. 1단계: 분류헤드만 → 2단계: 마지막 블록 해동 → 3단계: 전체 해동. 급격한 가중치 변동(Catastrophic Forgetting) 방지.',
  },
  {
    label: '실전 가이드: 언제 얼마나 동결할 것인가',
    body: '규칙: 도메인 유사도 높으면 많이 freeze, 낮으면 적게 freeze. 데이터 < 1K: 헤드만. 1K~10K: 상위 2~3블록. 10K+: 전체 fine-tune 가능.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
