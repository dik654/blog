import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '기울기 소실 수치 분석',
    body: '3층 신경망: x=0.5, w1=w2=w3=0.1.\n순전파: z1=0.05, h1=sigmoid(0.05)=0.5125 → z2=0.05125, h2=0.5128 → y=0.5128.\n역전파 Layer3: sigmoid\'=0.2498, dL/dh2 = 0.2498 x 0.1 = 0.02498.\nLayer2: dL/dh1 = 0.02498 x 0.2498 x 0.1 = 0.000624.\nLayer1: dL/dw1 = 0.000624 x 0.2498 x 0.5 = 0.0000780.\n비율: Layer3 0.02498 / Layer1 0.0000780 = 약 320배 감소.',
  },
  {
    label: '깊이별 기울기 감쇠',
    body: '층당 감쇠율 r = sigmoid\'(z) x w = 0.25 x 0.1 = 0.025.\nL층 이후: g_L = g_final x r^L.\n10층: 0.025^10 = 9.5 x 10^-17.\n50층: 0.025^50 = 8.9 x 10^-81.\n100층: 0.025^100 = 7.9 x 10^-161 → 수치적으로 완전 0.\n완화 기법: ReLU(기울기 0 or 1), Xavier/He 초기화, BatchNorm, LSTM 게이트.\n100층+ 에서는 이조차 부족 → ResNet skip connection이 근본 해결.',
  },
];

export const C = {
  gradient: '#ef4444',
  layer: '#3b82f6',
  fix: '#10b981',
  dim: '#94a3b8',
};
