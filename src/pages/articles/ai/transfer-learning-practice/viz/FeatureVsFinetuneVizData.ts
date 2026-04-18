import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  feature: '#3b82f6',
  finetune: '#10b981',
  data: '#f59e0b',
  decision: '#8b5cf6',
  warn: '#ef4444',
};

export const STEPS: StepDef[] = [
  {
    label: 'Feature Extraction: Backbone 동결 + 분류 헤드만 학습',
    body: 'Pretrained 모델의 마지막 레이어 출력을 고정된 피처 벡터로 사용. 새 분류 헤드(FC)만 학습. 빠르고 안전하지만 표현력 제한.',
  },
  {
    label: 'Full Fine-tuning: 전체 가중치 갱신',
    body: '모든 레이어를 학습 가능 상태로 두고 작은 LR로 전체 미세조정. 더 높은 성능 가능하지만 과적합 위험 + 메모리 비용 증가.',
  },
  {
    label: '성능 비교: 데이터 규모에 따른 교차점',
    body: '데이터 < 1K: Feature Extraction 우세 (과적합 방지). 데이터 > 10K: Fine-tuning 우세 (적응력). 1K~10K: Gradual Unfreezing 권장.',
  },
  {
    label: '실전 결정 Flowchart',
    body: '1) 데이터 규모 확인 → 2) 도메인 유사도 확인 → 3) 컴퓨팅 자원 확인 → 최적 전략 결정. 대부분 "일단 Feature Extraction, 부족하면 Fine-tuning" 순서.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
