export const memoryStrategyCode = `GPU 메모리 관리 전략:

  메모리 예산 계산 (BN254, 2^23 constraints):
  ┌──────────────────────────────────────────────────┐
  │ CRS bases (G1):  2^23 × 64B  = 512 MB           │
  │ CRS bases (G2):  2^23 × 128B = 1024 MB          │
  │ Witness scalars: 2^23 × 32B  = 256 MB            │
  │ NTT workspace:   2^23 × 32B  = 256 MB (×2 버퍼) │
  │ MSM buckets:     2^16 × 96B  = 6 MB (per window) │
  │ 합계: ~2.5 GB (G1 only) / ~3.5 GB (G1+G2)       │
  └──────────────────────────────────────────────────┘

  전략 1: 스트림 처리 (Stream Processing)
    for chunk in polynomial.chunks(CHUNK_SIZE):
      cudaMemcpyAsync(d_chunk, chunk, H2D, stream)
      ntt_kernel<<<grid, block, 0, stream>>>(d_chunk)
    // 전송과 연산 오버랩 → PCIe 유휴 시간 제거

  전략 2: Pinned Memory + Async Transfer
    cudaHostAlloc(&h_crs, size, cudaHostAllocDefault)  // 고정 메모리
    cudaMemcpyAsync(d_crs, h_crs, H2D, stream_0)      // 비동기 전송
    msm_kernel<<<...>>>(d_prev_crs, ...)               // 이전 청크 연산
    // 전송과 연산이 서로 다른 스트림에서 동시 실행

  전략 3: Multi-GPU 분할 (MSM 분산)
    GPU 0: msm(bases[0..n/2], scalars[0..n/2])    // 포인트 절반
    GPU 1: msm(bases[n/2..n], scalars[n/2..n])    // 나머지 절반
    result = gpu0_result + gpu1_result              // 최종 합산
    // 2x GPU → MSM 시간 ~50% 감소`;

export const memoryBudgetRows = [
  { gpu: 'RTX 4090', vram: '24 GB', maxConstraints: '2^24', note: 'Groth16 가능, PLONK 타이트' },
  { gpu: 'A100 40GB', vram: '40 GB', maxConstraints: '2^25', note: '대규모 회로 가능' },
  { gpu: 'A100 80GB', vram: '80 GB', maxConstraints: '2^26', note: '초대형 회로 + CRS 상주' },
  { gpu: 'H100 SXM', vram: '80 GB', maxConstraints: '2^26+', note: 'HBM3 대역폭 이점' },
];
