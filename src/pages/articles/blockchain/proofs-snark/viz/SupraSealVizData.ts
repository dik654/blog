export const C = {
  pc1: '#f59e0b', pc2: '#10b981', c2: '#ec4899', opt: '#0ea5e9',
};

export const STEPS = [
  {
    label: 'PC1: SHA256 파이프라인 최적화',
    body: 'CPU L1/L2 캐시에 맞도록 데이터 배치',
  },
  {
    label: 'PC2: Poseidon GPU 배치',
    body: '메모리 코얼레싱으로 GPU 대역폭 극대화',
  },
  {
    label: 'C2: MSM 커널 최적화',
    body: '프리페치 + 윈도우 NAF 기법 — 점 연산 횟수 최소화',
  },
];
