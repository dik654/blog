export const PERF_STEPS = [
  { label: 'Pippenger MSM — O(n/log n)', body: '스칼라를 w비트 윈도우로 분할 → 2^w 버킷 분류 → 시프트 누적.' },
  { label: '병렬 처리 — rayon 멀티스레드', body: 'A·B 동시 실행, MSM 윈도우별 병렬화. 8코어 ~5-7배 속도.' },
  { label: '메모리 최적화', body: 'Affine 포인트 저장(2좌표), Projective 연산(3좌표). 메모리 33% 절감.' },
  { label: '벤치마크 — CPU vs GPU', body: 'Prove ~1.8s(CPU) vs ~0.3s(GPU). MSM이 78%로 병목.' },
];

export const BARS = [
  { label: 'Witness', pct: 5, color: '#6366f1' },
  { label: 'FFT(h)', pct: 17, color: '#10b981' },
  { label: 'MSM', pct: 78, color: '#f59e0b' },
];

export const PIPPENGER_BOXES = ['윈도우 분할', '버킷 분류', '시프트 누적'];

export const PARALLEL_ROWS = [
  { l: 'A MSM', c: '#6366f1', y: 56 },
  { l: 'B MSM', c: '#10b981', y: 72 },
];

export const MEM_ROWS = [
  { l: 'Affine (x,y)', c: '#10b981', x: 60 },
  { l: 'Projective (X,Y,Z)', c: '#f59e0b', x: 200 },
];

export const GPU_ROWS = [
  { l: 'CPU ~1.8s', w: 180, c: '#6366f1' },
  { l: 'GPU ~0.3s', w: 30, c: '#10b981' },
];
