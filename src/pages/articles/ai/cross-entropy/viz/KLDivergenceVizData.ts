export const STEPS = [
  { label: 'CE = H(P) + KL(P‖Q)', body: 'P=[1,0,0], Q=[0.7,0.2,0.1] → CE=0.51, H=0, KL=0.51' },
  { label: 'KL 수치 계산', body: 'KL = Σ P(x)·log(P/Q) = 1·log(1/0.7) = 0.51 bit' },
  { label: '비대칭성: KL(P‖Q) ≠ KL(Q‖P)', body: 'P→Q 기준과 Q→P 기준의 결과가 다름' },
  { label: 'JS Divergence = 대칭 버전', body: 'JS = (KL(P‖M)+KL(Q‖M))/2, M=(P+Q)/2' },
];
