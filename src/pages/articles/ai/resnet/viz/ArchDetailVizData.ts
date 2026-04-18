import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'ResNet-50 전체 구조',
    body: 'Stem: Conv 7x7 stride=2 → 112x112x64. MaxPool 3x3 stride=2 → 56x56x64.\nStage 1 (conv2_x): Bottleneck x3, 56x56x256.\nStage 2 (conv3_x): 첫 블록 stride=2, Bottleneck x4, 28x28x512.\nStage 3 (conv4_x): Bottleneck x6, 14x14x1024.\nStage 4 (conv5_x): Bottleneck x3, 7x7x2048.\nClassifier: GAP → 2048 → Linear → 1000.\n블록 합계: 3+4+6+3 = 16 blocks x 3 conv = 48 + Stem 1 + FC 1 = 50 layers.\n파라미터 25.5M, FLOPs 4.1G.',
  },
  {
    label: 'BatchNorm + ReLU 역할',
    body: 'BatchNorm 수식: x_hat = (x - mu_B) / sqrt(sigma^2_B + eps). y = gamma x x_hat + beta.\n효과: 학습 안정화, 초기화 민감도 감소, regularization, 속도 2~4배.\nResNet v1 순서: Conv → BN → ReLU → Conv → BN → (+x) → ReLU.\nResNet v2 (Pre-activation): BN → ReLU → Conv → BN → ReLU → Conv → (+x).\nv2 장점: BN이 shortcut 바깥 → 기울기 더 깨끗.\n대안: LayerNorm(Transformer), GroupNorm(small batch), InstanceNorm(스타일).',
  },
];

export const C = {
  stem: '#f59e0b',
  stage: '#3b82f6',
  bn: '#8b5cf6',
  relu: '#10b981',
  dim: '#94a3b8',
};
