export const speedupTableRows = [
  { op: 'MSM (2^23 points)', cpu: '~45s', gpu: '~0.5s', speedup: '~90x' },
  { op: 'NTT (2^23 degree)', cpu: '~8s', gpu: '~0.12s', speedup: '~65x' },
  { op: 'Groth16 전체 (2^20)', cpu: '~120s', gpu: '~3s', speedup: '~40x' },
  { op: 'PLONK 전체 (2^20)', cpu: '~180s', gpu: '~5s', speedup: '~36x' },
];
