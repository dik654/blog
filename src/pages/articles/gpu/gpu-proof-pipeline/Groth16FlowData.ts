export const groth16PipelineCode = `Groth16 GPU 증명 파이프라인:

  ① Witness 계산 (CPU)
     w = solve(R1CS constraints)          // 순차적 — GPU 불가

  ② NTT: A(x), B(x), C(x) 다항식 평가
     a_coeff → gpu_ntt(a_coeff, ω, n)    // GPU 커널 1: NTT
     b_coeff → gpu_ntt(b_coeff, ω, n)    // GPU 커널 2: NTT
     c_coeff → gpu_ntt(c_coeff, ω, n)    // GPU 커널 3: NTT

  ③ Pointwise 곱 + INTT: H(x) 계산
     h_eval[i] = (a_eval[i] * b_eval[i] - c_eval[i]) / z_eval[i]
     h_coeff = gpu_intt(h_eval, ω⁻¹, n) // GPU 커널 4: Inverse NTT

  ④ MSM: 증명 원소 [A]₁, [B]₂, [C]₁ 계산
     proof_A = gpu_msm(crs_a, [α, w₀..wₙ, r])  // GPU 커널 5
     proof_B = gpu_msm(crs_b, [β, w₀..wₙ, s])  // GPU 커널 6 (G2)
     proof_C = gpu_msm(crs_c, [w_priv, h, rA-sB]) // GPU 커널 7

  ⑤ 결과 조합: π = (A, B, C) — 256 bytes
     cudaMemcpy(proof, device_proof, D2H) // GPU → CPU 복사

  Host↔Device 전송:
     H2D: witness (n × 32B) + CRS bases (n × 64B)
     D2H: proof elements (3 × 64B = 192B)
     병목: CRS 전송 → GPU 메모리에 상주시켜 해결`;

export const groth16StepBreakdown = [
  { step: 'Witness', device: 'CPU', pct: '~5%', reason: '제약 조건 순차 풀이' },
  { step: 'NTT x3', device: 'GPU', pct: '~15%', reason: 'A,B,C 다항식 평가' },
  { step: 'Pointwise + INTT', device: 'GPU', pct: '~10%', reason: 'H(x) 몫 다항식' },
  { step: 'MSM x3', device: 'GPU', pct: '~65%', reason: '증명 원소 계산' },
  { step: 'D2H + 조합', device: 'CPU', pct: '~5%', reason: '결과 전송' },
];
