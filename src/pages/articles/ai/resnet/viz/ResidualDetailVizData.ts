import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '두 경로 기울기 상세 계산',
    body: '순전파: x=0.5, h1=0.5125, h2=0.5128, F(x)=0.5128, y = F(x)+x = 1.0128.\n메인 경로: dL/dw1 = 1 x 0.02498 x 0.02498 x 0.1249 = 7.79e-5.\nSkip 경로: dy/dx = 1 (identity) → 기울기 직접 전달.\n실제 ResNet: dL/dx_l = dL/dx_{l+1} x (1 + dF/dx_l).\nL층 이후: dL/dx_0 = dL/dx_L x 곱(1 + dF_l/dx_l).\n곱에 1이 포함되어 지수적 감쇠 방지.',
  },
  {
    label: '학습 안정성 비교',
    body: 'Plain Net: 10층 수렴, 20층 느린 수렴, 34층+ 학습 실패.\nResNet: 18층 빠른 수렴, 34~152층 모두 수렴 (152층 최고 성능).\n1000층+ 시도: 수렴하나 더 이상 개선 없음.\nResNet 효과: 기울기 소실 완화, 최적화 난이도 감소, 손실 평면 매끄러움.\n"Ensemble of Shallow Networks" 해석 (Veit 2016).\nn개 residual block → 2^n개 경로. ResNet-152(50 blocks): 2^50 = 10^15 경로.',
  },
];

export const C = {
  main: '#ef4444',
  skip: '#10b981',
  compare: '#3b82f6',
  dim: '#94a3b8',
  accent: '#8b5cf6',
};
