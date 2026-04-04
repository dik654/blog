export const C = {
  msm: '#ec4899', ntt: '#6366f1', gpu: '#0ea5e9', cpu: '#6b7280',
};

export const STEPS = [
  {
    label: 'MSM이 증명 시간의 70-80%',
    body: 'Multi-Scalar Multiplication: 수백만 개 스칼라 × 타원곡선 점',
  },
  {
    label: 'NTT: 다항식 평가',
    body: 'Number Theoretic Transform — FFT의 유한체 버전',
  },
  {
    label: 'CPU/GPU 하이브리드 모드',
    body: 'BELLMAN_CPU_UTILIZATION 환경변수로 비율 조절',
  },
];
