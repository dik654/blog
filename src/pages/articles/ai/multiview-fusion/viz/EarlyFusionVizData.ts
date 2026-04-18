import type { StepDef } from '@/components/ui/step-viz';

export const C = {
  view1: '#6366f1',   // indigo
  view2: '#10b981',   // emerald
  backbone: '#8b5cf6', // violet
  fuse: '#f59e0b',    // amber
  cls: '#ef4444',     // red
  siamese: '#0ea5e9', // sky
};

export const STEPS: StepDef[] = [
  {
    label: 'Channel Concatenation: 채널 축 결합',
    body: 'View 1 (H×W×3) + View 2 (H×W×3) → H×W×6 텐서. conv1 레이어의 in_channels를 3→6으로 변경하고 나머지 백본은 그대로 사용.',
  },
  {
    label: 'Siamese Network: 가중치 공유 인코딩',
    body: '같은 CNN 백본(가중치 공유)으로 각 뷰를 독립 인코딩. 두 피처 맵을 concat 후 공유 분류 헤드로 전달. 구조적 유사성을 자연스럽게 학습.',
  },
  {
    label: 'Early Fusion 장단점',
    body: '장점: 저수준 피처(엣지, 텍스처) 간 상호작용이 초기 레이어부터 가능.\n단점: 뷰 수가 늘면 입력 채널이 비례 증가. 사전학습 모델의 첫 레이어 재학습 필요.',
  },
];

/** 채널 결합 시각화용 — RGB 채널 레이블 */
export const CHANNELS = [
  { label: 'R', color: '#ef4444' },
  { label: 'G', color: '#22c55e' },
  { label: 'B', color: '#3b82f6' },
];
