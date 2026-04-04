export const PIPPENGER_CODE = `Pippenger MSM (Multi-Scalar Multiplication)
  입력: n개 스칼라 sᵢ, n개 포인트 Pᵢ
  출력: Σ sᵢ · Pᵢ

  ① 스칼라를 w비트 윈도우로 분할
     w = ⌈log₂(n)⌉ + 2  (최적 윈도우)
  ② 각 윈도우에서 2^w개 버킷에 분류
  ③ 버킷 합산 → 윈도우 결과
  ④ 윈도우 결과를 시프트-누적

  복잡도: O(n / log n) — 나이브 O(n) 대비 log n배 개선`;

export const PARALLEL_CODE = `병렬 처리 전략 (rayon 기반)
  ① A, B MSM → rayon::join으로 병렬 실행
  ② B_g2, B_g1 → rayon::join으로 병렬 실행
  ③ 각 MSM 내부: 윈도우별 rayon::scope 병렬
  ④ FFT/IFFT: 버터플라이 연산 병렬화

  스레드 수 ≈ CPU 코어 수 (자동 감지)
  → 8코어 기준 약 5~7배 속도 향상`;

export const BENCHMARK_CODE = `벤치마크 비교 (BN254, 2^16 제약 기준)
  ┌─────────────┬──────────┬──────────┐
  │ 단계        │ 시간     │ 비중     │
  ├─────────────┼──────────┼──────────┤
  │ Setup       │ ~2.5s    │ 1회성    │
  │ Prove       │ ~1.8s    │ 매번     │
  │  ├ witness  │  ~0.1s   │  5%      │
  │  ├ FFT(h)   │  ~0.3s   │  17%     │
  │  └ MSM(A,B,C)│ ~1.4s   │  78%     │
  │ Verify      │ ~4ms     │ O(1)     │
  └─────────────┴──────────┴──────────┘
  GPU 가속 시 Prove ~0.3s (6배 개선)`;
