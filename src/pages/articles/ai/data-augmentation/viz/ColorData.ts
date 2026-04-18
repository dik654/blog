import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'ColorJitter — 밝기·대비·채도·색조 랜덤 변형',
    body: 'brightness(±0.2), contrast(±0.2), saturation(±0.2), hue(±0.1)\n각 파라미터가 독립적으로 랜덤 적용 — 조합 폭발로 다양성 극대화',
  },
  {
    label: 'Normalization — ImageNet mean/std로 정규화',
    body: 'mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]\n사전학습 모델 사용 시 필수 — 학습 때와 동일한 분포로 맞춰야 전이학습 효과',
  },
  {
    label: 'CLAHE — 지역 히스토그램 평활화',
    body: 'Contrast Limited Adaptive Histogram Equalization\n이미지를 타일로 나누고 각 타일의 히스토그램을 독립 평활화\n어두운 영역의 디테일을 살리면서 밝은 영역의 과포화 방지',
  },
  {
    label: 'Random Erasing — 영역 마스킹으로 가려짐 학습',
    body: '랜덤 영역을 0(검정) 또는 랜덤 노이즈로 채움\n물체가 부분적으로 가려진 상황을 시뮬레이션\np=0.5, scale=(0.02, 0.33), ratio=(0.3, 3.3)이 표준 설정',
  },
];

export const COLORS = {
  brightness: '#f59e0b',
  contrast: '#ef4444',
  saturation: '#10b981',
  hue: '#8b5cf6',
  normalize: '#3b82f6',
  clahe: '#6366f1',
  erasing: '#64748b',
};
