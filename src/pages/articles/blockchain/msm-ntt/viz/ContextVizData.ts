export const C = { msm: '#6366f1', ntt: '#f59e0b', err: '#ef4444', ok: '#10b981', zk: '#8b5cf6' };

export const STEPS = [
  {
    label: 'MSM 커널: Pippenger 버킷 누적 (SM별 독립)',
    body: 'window = scalar[i] >> (w*j), bucket[window] += point[i] → SM별 독립 버킷 → 최종 리덕션',
  },
  {
    label: 'NTT 커널: Cooley-Tukey 나비 연산 (공유 메모리)',
    body: '__shared__ Fr tile[1024], 나비: a[j]+=w*a[j+n/2], a[j+n/2]=a[j]-w*a[j+n/2], __syncthreads()',
  },
  {
    label: 'Pippenger 분할: O(n/log n) 복잡도',
    body: '스칼라를 w-bit 윈도우로 분할 → 2^w 버킷 × ceil(256/w) 윈도우, 독립 누적 → GPU 병렬화 최적',
  },
  {
    label: 'GPU 벤치마크: MSM 2^24점 RTX 4090 = 1.2초',
    body: 'CPU(32코어): ~120초 → GPU(4090): ~1.2초 = 100배, H100: ~0.5초 = 240배 가속',
  },
];
