export const C = { groth: '#6366f1', gpu: '#f59e0b', msm: '#10b981', supra: '#8b5cf6', err: '#ef4444' };

export const STEPS = [
  {
    label: 'Filecoin이 SNARK를 쓰는 이유',
    body: '봉인(PoRep)과 저장(PoSt) 증명을 온체인에 제출',
  },
  {
    label: 'Groth16 증명 파이프라인',
    body: '회로 합성(R1CS) → FFT/NTT(QAP 다항식 평가)',
  },
  {
    label: 'GPU 가속: bellperson',
    body: 'MSM이 전체 증명 시간의 70~80% 차지',
  },
  {
    label: 'SupraSeal: 전 단계 최적화',
    body: 'PC1: SHA256 파이프라인 (CPU 캐시 최적화)',
  },
];
