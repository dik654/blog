import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  general: '#6366f1',
  domain: '#f59e0b',
  task: '#10b981',
  alert: '#ef4444',
  accent: '#8b5cf6',
  lr: '#3b82f6',
};

export const STEPS: StepDef[] = [
  {
    label: 'Continued Pretraining: MLM/CLM으로 도메인 코퍼스 학습',
    body: 'Masked Language Modeling(MLM): [MASK] 토큰 예측으로 양방향 문맥 학습\nCausal Language Modeling(CLM): 다음 토큰 예측으로 생성 능력 학습\n기존 가중치 위에 도메인 코퍼스를 추가 학습하는 것이 핵심.',
  },
  {
    label: '학습률 설정: 원래의 1/10 ~ 1/5 수준',
    body: '너무 높은 LR → 사전학습 지식 파괴 (catastrophic forgetting)\n너무 낮은 LR → 도메인 적응 부족, 수렴 느림\n권장: 원래 pretrain LR의 1/10 수준 (예: 2e-5 → 2e-6)',
  },
  {
    label: '카타스트로픽 망각(Catastrophic Forgetting) 방지',
    body: '도메인 학습 중 일반 지식이 덮어씌워지는 현상.\n방지책: 1) 낮은 LR  2) 일반 데이터 혼합(5~10%)  3) EWC/L2 정규화\n완전히 막을 수는 없지만, 혼합 데이터가 가장 실용적.',
  },
  {
    label: '데이터량 vs 효과: 수확 체감 곡선',
    body: '도메인 데이터 1M 토큰 → 큰 성능 점프\n10M 토큰 → 추가 개선 폭 감소\n100M+ 토큰 → 수확 체감, 비용 대비 효과 하락\n최적점은 도메인 복잡도에 따라 달라짐.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
