import type { StepDef } from '@/components/ui/step-viz';

export const C = {
  view1: '#6366f1',   // indigo
  view2: '#10b981',   // emerald
  backbone: '#8b5cf6', // violet
  fuse: '#f59e0b',    // amber
  cls: '#ef4444',     // red
  weight: '#0ea5e9',  // sky — 가중 결합
};

export const STEPS: StepDef[] = [
  {
    label: 'Late Fusion: 독립 인코딩 → 피처 결합',
    body: '각 뷰를 별도 백본으로 인코딩하여 피처 벡터를 추출. 두 벡터를 concat(또는 평균)한 뒤 분류 헤드에 전달.',
  },
  {
    label: '가중 결합 변형 (Weighted Late Fusion)',
    body: '단순 concat 대신 학습 가능한 가중치 w1, w2로 피처를 결합: f = w1·f1 + w2·f2. 유용한 뷰에 높은 가중치를 자동 부여.',
  },
  {
    label: 'Late Fusion 장단점',
    body: '장점: 각 뷰의 독립적 표현 학습. 사전학습 백본 그대로 사용(ImageNet pretrained).\n단점: 뷰 간 저수준 상호작용 불가. 파라미터 2배(백본×뷰 수).',
  },
];

/** 가중치 시각화용 */
export const WEIGHT_EXAMPLES = [
  { w1: 0.7, w2: 0.3, desc: '정면 뷰가 더 유용한 경우' },
  { w1: 0.4, w2: 0.6, desc: '측면 뷰가 더 유용한 경우' },
  { w1: 0.5, w2: 0.5, desc: '두 뷰가 동등하게 중요' },
];
