import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'ResNet의 학계 영향력',
    body: '"Deep Residual Learning for Image Recognition" He et al., CVPR 2016.\n인용 횟수: 200,000+ — CV 논문 역대 1위.\nILSVRC 2015: Classification, Detection, Localization, COCO 모두 1위.\nImageNet Top-5 error 3.57% — 인간(5.1%) 첫 돌파.\n후속: DenseNet, ResNeXt, SENet, EfficientNet.\nTransformer(2017)의 residual + LayerNorm = ResNet 철학 직계 계승.',
  },
  {
    label: 'Loss Landscape 분석',
    body: '"Visualizing the Loss Landscape" Li et al. 2018.\nPlain Network: 비볼록, 거친 지형, 여러 지역 최솟값, 초기값에 민감.\nResNet: 매끄러운 지형, 하나의 큰 basin, SGD가 쉽게 최솟값 도달.\nSkip connection이 Lipschitz 성질 개선 + 경로 다양성으로 평활화.\n실무 의의: 초기화 덜 민감, 학습률 자유, 배치 크기 확장, Fine-tuning 수월.\n일반화: Dense connections, Multi-scale shortcuts, Attention-weighted skip.',
  },
];

export const C = {
  award: '#f59e0b',
  perf: '#10b981',
  plain: '#ef4444',
  smooth: '#3b82f6',
  dim: '#94a3b8',
};
