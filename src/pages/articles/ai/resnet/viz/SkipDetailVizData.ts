import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Skip Connection 수학적 원리',
    body: 'y = F(x) + x. F(x) = 학습할 변환 (2~3 conv layer).\n역전파: dL/dx = dL/dy x (dF/dx + 1).\n"+1" 항(identity)이 직접 경로 → dF/dx가 0이라도 기울기 보장.\n100층에서도: dL/dx_0 = dL/dy_100 x 곱(1 + dF_l/dx_l).\nF(x)=0이면: y = 0 + x = x (항등 함수, 최소 성능 보장).\nF(x)가 유의미하면: y = F(x) + x (잔차 추가, 작은 개선 누적).',
  },
  {
    label: 'Residual Block 종류',
    body: 'Basic Block (ResNet-18, 34): Conv3x3 → BN → ReLU → Conv3x3 → BN → (+x) → ReLU.\nBottleneck Block (ResNet-50, 101, 152): 1x1(축소) → 3x3 → 1x1(복원) → (+x).\nBottleneck 효율: 256ch 기준 Basic 1.18M vs Bottleneck 70K → 17배 절감.\nProjection Shortcut: 차원 변경 시 y = F(x) + W_s x (1x1 conv 매칭).\nPre-activation (v2, 2016): BN → ReLU → Conv. BN이 shortcut 바깥 → 기울기 더 부드러움.',
  },
];

export const C = {
  skip: '#10b981',
  main: '#3b82f6',
  bottleneck: '#8b5cf6',
  dim: '#94a3b8',
  warn: '#f59e0b',
};
