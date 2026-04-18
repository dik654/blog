import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'FC vs CNN 파라미터 비교',
    body: '224x224x3 컬러 이미지 입력 기준.\nFC 128뉴런: 150,528 x 128 = 19,267,584 파라미터.\nCNN 32필터(3x3): 3x3x3x32 = 864 + 32(편향) = 896 파라미터.\n비율: 1,920만 / 896 = 21,428배 감소.\n가중치 공유(weight sharing)가 핵심 — FC는 연결마다 별도 가중치, CNN은 동일 필터를 전체에 슬라이딩.\n추가 이점: 지역성(근방 픽셀만 결합), 위치 불변(어디서든 같은 패턴 감지), 과적합 감소.',
  },
  {
    label: 'CNN 연산 흐름 표준',
    body: '입력: (B, 3, 224, 224) 배치x채널xHxW.\nConv Block 반복: Conv2d → ReLU → Conv2d → ReLU → MaxPool2d.\n해상도 감소: 224 → 112 → 56 → 28 → 1.\n채널 수 증가: 3 → 64 → 128 → 256.\nClassifier: GlobalAvgPool → Flatten → Linear → Softmax.\n핵심 패턴: "해상도↓ + 채널수↑" — 저수준에서 고수준으로 특성 추상화.',
  },
];

export const C = {
  fc: '#ef4444',
  cnn: '#10b981',
  flow: '#6366f1',
  dim: '#94a3b8',
  ch: '#3b82f6',
};
