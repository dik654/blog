export const plonkPipelineCode = `PLONK GPU 증명 파이프라인 (5 Round):

  Round 1 — Wire 커밋먼트 (3x NTT + 3x MSM)
    a(X), b(X), c(X) = ifft(witness_a/b/c)     // 3x GPU INTT
    [a]₁ = gpu_msm(SRS, a_coeffs)              // 3x GPU MSM
    [b]₁ = gpu_msm(SRS, b_coeffs)
    [c]₁ = gpu_msm(SRS, c_coeffs)

  Round 2 — 순열 다항식 (1x NTT + 1x MSM)
    z(X) = accumulate(σ permutation, β, γ)      // CPU: grand product
    [z]₁ = gpu_msm(SRS, z_coeffs)              // 1x GPU MSM

  Round 3 — 몫 다항식 (7x NTT + 3x MSM)
    t(X) = (gate + perm + boundary) / Zₕ(X)    // 다수 NTT 필요
    t_lo, t_mid, t_hi = split(t, n)            // 차수 3n → 3등분
    [t_lo]₁, [t_mid]₁, [t_hi]₁ = gpu_msm x3   // 3x GPU MSM

  Round 4 — 평가 (scalar operations)
    ā = a(ζ), b̄ = b(ζ), c̄ = c(ζ), ...         // 점 평가 (CPU)

  Round 5 — 오프닝 증명 (2x MSM)
    W_ζ(X) = linearization / (X - ζ)           // 1x GPU MSM
    W_ζω(X) = z(X) / (X - ζω)                 // 1x GPU MSM`;

export const plonkVsGroth16 = [
  { metric: 'MSM 호출 횟수', groth16: '3회 (대규모)', plonk: '10회 (소규모)' },
  { metric: 'NTT 호출 횟수', groth16: '4회', plonk: '11+회' },
  { metric: '단일 MSM 크기', groth16: 'n points', plonk: 'n points' },
  { metric: 'CRS 크기', groth16: '회로별 고유', plonk: 'Universal SRS' },
  { metric: 'GPU 활용 패턴', groth16: '대형 MSM 집중', plonk: '균일한 NTT+MSM 반복' },
  { metric: 'GPU 파이프라인', groth16: 'burst형', plonk: 'stream형 (예측 용이)' },
];
