import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  general: '#6366f1',
  domain: '#f59e0b',
  task: '#10b981',
  alert: '#ef4444',
  accent: '#8b5cf6',
  classify: '#3b82f6',
  seq: '#ec4899',
};

export const STEPS: StepDef[] = [
  {
    label: 'Task-specific Head: 도메인 모델 위에 목적별 헤드 추가',
    body: '도메인 적응된 인코더 위에 작은 분류/회귀/시퀀스 헤드를 얹어 학습.\n인코더는 freeze 또는 낮은 LR, 헤드는 높은 LR로 학습 — 이중 학습률 전략.',
  },
  {
    label: '태스크 유형별 접근: 분류 / 회귀 / 시퀀스 라벨링',
    body: '분류: [CLS] 토큰 → Linear → Softmax (양성/음성 등)\n회귀: [CLS] 토큰 → Linear → MSE Loss (수치 예측)\n시퀀스 라벨링: 각 토큰 → Linear → CRF (NER, POS tagging)',
  },
  {
    label: '소량 라벨 데이터 전략: 100~1000개로 효과적 학습',
    body: '도메인 적응 모델은 이미 도메인 지식 보유 → 소량 라벨로도 수렴.\n핵심: 데이터 증강 + 교차 검증 + 조기 종료(early stopping)\n라벨 500개면 대부분의 분류 태스크에서 80%+ 달성 가능.',
  },
  {
    label: 'Few-shot Learning 연계: 라벨이 극소량일 때',
    body: 'Prompt-tuning: "[X]는 [MASK] 감성이다" 형태로 MLM 재활용\nIn-context Learning: 예시 몇 개 + 질의로 추론 (학습 없이)\nSetFit: Contrastive + 작은 분류 헤드 (라벨 8개로 90%+)',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
