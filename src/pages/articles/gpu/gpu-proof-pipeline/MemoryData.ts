export const memoryBudgetRows = [
  { gpu: 'RTX 4090', vram: '24 GB', maxConstraints: '2^24', note: 'Groth16 가능, PLONK 타이트' },
  { gpu: 'A100 40GB', vram: '40 GB', maxConstraints: '2^25', note: '대규모 회로 가능' },
  { gpu: 'A100 80GB', vram: '80 GB', maxConstraints: '2^26', note: '초대형 회로 + CRS 상주' },
  { gpu: 'H100 SXM', vram: '80 GB', maxConstraints: '2^26+', note: 'HBM3 대역폭 이점' },
];
