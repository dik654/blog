export const plonkVsGroth16 = [
  { metric: 'MSM 호출 횟수', groth16: '3회 (대규모)', plonk: '10회 (소규모)' },
  { metric: 'NTT 호출 횟수', groth16: '4회', plonk: '11+회' },
  { metric: '단일 MSM 크기', groth16: 'n points', plonk: 'n points' },
  { metric: 'CRS 크기', groth16: '회로별 고유', plonk: 'Universal SRS' },
  { metric: 'GPU 활용 패턴', groth16: '대형 MSM 집중', plonk: '균일한 NTT+MSM 반복' },
  { metric: 'GPU 파이프라인', groth16: 'burst형', plonk: 'stream형 (예측 용이)' },
];
