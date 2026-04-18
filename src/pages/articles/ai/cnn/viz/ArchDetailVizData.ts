import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '주요 CNN 아키텍처 상세 비교',
    body: 'LeNet-5(1998): 7층, 60K params — 최초 실용 CNN.\nAlexNet(2012): 8층, 60M — ReLU, Dropout, GPU 학습 도입.\nVGG-16(2014): 16층, 138M — 3x3 필터만 반복.\nGoogLeNet(2014): 22층, 7M — Inception module, 1x1 Conv.\nResNet-50(2015): 50층, 26M — Skip connection, BatchNorm.\nDenseNet-121(2017): 121층, 8M — 모든 이전 층 연결.\nEfficientNet(2019): 5.3M — Compound scaling (NAS).\nConvNeXt-L(2022): 198M — Transformer 설계 역수입.',
  },
];

export const C = {
  early: '#ef4444',
  mid: '#3b82f6',
  res: '#10b981',
  modern: '#8b5cf6',
  dim: '#94a3b8',
};
