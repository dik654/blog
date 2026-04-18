import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Albumentations — 고속 이미지 증강 라이브러리',
    body: 'OpenCV 기반으로 PIL/torchvision보다 2~10배 빠름\nCompose로 변환을 연결하고 각 변환에 p(확률)를 설정\n동일 파이프라인으로 이미지 + 바운딩박스 + 마스크를 동시 변환',
  },
  {
    label: 'Train 파이프라인 — 강한 증강으로 다양성 확보',
    body: 'Compose([RandomCrop, HFlip, ColorJitter, Normalize])\n순서가 중요: 기하학적 변환 → 색상 변환 → 정규화\nOneOf([Blur, MedianBlur, GaussNoise], p=0.3) — 하나만 랜덤 선택',
  },
  {
    label: 'Test 파이프라인 — 최소 변환만 적용',
    body: 'Compose([Resize(256), CenterCrop(224), Normalize])\n테스트에서는 랜덤 요소 없이 결정적(deterministic) 변환만\n학습과 동일한 Normalize 파라미터를 반드시 사용',
  },
  {
    label: 'TTA — 테스트 시에도 증강으로 성능 부스팅',
    body: 'Test Time Augmentation: 테스트 이미지를 N번 증강하여 예측 평균\n원본 + HFlip + 다중 Crop → 5~10개 예측을 앙상블\n대회에서 마지막 0.1~0.3% 성능 향상에 효과적. 추론 시간은 N배 증가',
  },
];

export const COLORS = {
  compose: '#6366f1',
  train: '#10b981',
  test: '#3b82f6',
  tta: '#f59e0b',
  oneof: '#ef4444',
};
