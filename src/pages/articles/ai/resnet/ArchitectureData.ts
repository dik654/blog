export const blockSteps = [
  {
    label: 'Basic Block (ResNet-18/34)',
    body: '3x3 Conv → BN → ReLU → 3x3 Conv → BN → (+x) → ReLU',
  },
  {
    label: 'Bottleneck Block (ResNet-50+)',
    body: '1x1 Conv(축소) → 3x3 Conv → 1x1 Conv(확장) → (+x) → ReLU. 채널 수 줄여 연산 절약',
  },
  {
    label: 'ResNet 변형 비교',
    body: 'ResNet-18: 8 Basic / ResNet-50: 16 Bottleneck / ResNet-152: 50 Bottleneck',
  },
];

export const variants = [
  { name: 'ResNet-18', blocks: 8, type: 'Basic', params: '11.7M', layers: 18 },
  { name: 'ResNet-34', blocks: 16, type: 'Basic', params: '21.8M', layers: 34 },
  { name: 'ResNet-50', blocks: 16, type: 'Bottleneck', params: '25.6M', layers: 50 },
  { name: 'ResNet-101', blocks: 33, type: 'Bottleneck', params: '44.5M', layers: 101 },
  { name: 'ResNet-152', blocks: 50, type: 'Bottleneck', params: '60.2M', layers: 152 },
];

export const CONV_COLOR = '#6366f1';
export const BN_COLOR = '#f59e0b';
export const RELU_COLOR = '#10b981';
