import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '합성곱 연산 수식',
    body: 'Y[i,j,c_out] = Sum X[i+dx,j+dy,c_in] x K[dx,dy,c_in,c_out].\n출력 크기: H\' = (H - k + 2p) / s + 1.\n예시: 224x224, k=3, p=1, s=1 → 출력 224 (유지).\n예시: 224x224, k=3, p=1, s=2 → 출력 112 (다운샘플링).\n파라미터: k^2 x C_in x C_out + C_out (편향).\nConv2d(64, 128, k=3) → 3x3x64x128 + 128 = 73,856.',
  },
  {
    label: '커널 유형과 Pooling',
    body: 'Sobel X (수평 엣지): [-1 0 1; -2 0 2; -1 0 1].\nGaussian Blur (노이즈 제거): 1/16 x [1 2 1; 2 4 2; 1 2 1].\nCNN 통찰: 이런 커널을 학습으로 자동 발견.\n첫 층: 엣지(Gabor-like), 중간: 텍스처, 후반: 의미 단위.\nPooling: Max(최대값, 위치 무시), Avg(평균), GAP(채널 전체 → 1 스칼라, FC 대체).\nPadding: Zero(기본), Reflect(반사), Replicate(복제).',
  },
];

export const C = {
  conv: '#3b82f6',
  kernel: '#8b5cf6',
  pool: '#10b981',
  dim: '#94a3b8',
  warn: '#f59e0b',
};
