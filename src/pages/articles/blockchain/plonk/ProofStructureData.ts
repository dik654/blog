export const COMMIT_POINTS_CODE = `커밋먼트 포인트 (G1 점 7개):
  [a]₁, [b]₁, [c]₁     — 와이어 다항식 (Round 1)
  [Z]₁                  — 순열 누적자 (Round 2)
  [t_lo]₁, [t_mid]₁, [t_hi]₁ — 몫 다항식 (Round 3)`;

export const EVAL_VALUES_CODE = `평가값 (Fr 스칼라 6개):
  ā = a(ζ),  b̄ = b(ζ),  c̄ = c(ζ)     — 와이어 평가
  σ̄_a = σ_a(ζ),  σ̄_b = σ_b(ζ)        — 순열 평가
  z̄_ω = Z(ζω)                         — 시프트된 Z 평가`;

export const OPENING_PROOF_CODE = `오프닝 증명 (G1 점 2개):
  [W_ζ]₁   — ζ에서의 배치 오프닝
  [W_ζω]₁  — ζω에서의 단일 오프닝

총 증명 크기:
  G1 × 9 = 576 bytes
  Fr × 6 = 192 bytes
  합계 ≈ 768 bytes (고정 크기!)`;

export const STRUCT_CODE = `struct Proof<E: PairingEngine> {
  // Round 1: Wire commitments
  a_comm: E::G1Affine,
  b_comm: E::G1Affine,
  c_comm: E::G1Affine,
  // Round 2: Permutation
  z_comm: E::G1Affine,
  // Round 3: Quotient
  t_lo_comm: E::G1Affine,
  t_mid_comm: E::G1Affine,
  t_hi_comm: E::G1Affine,
  // Round 4: Evaluations
  a_eval: E::Fr, b_eval: E::Fr, c_eval: E::Fr,
  s_sigma_1_eval: E::Fr, s_sigma_2_eval: E::Fr,
  z_shifted_eval: E::Fr,
  // Round 5: Opening proofs
  w_z: E::G1Affine, w_zw: E::G1Affine,
}`;
