export const PROVING_KEY_CODE = `struct ProvingKey<E: Pairing> {
  vk:            VerifyingKey<E>,     // 내장된 검증 키
  alpha_g1:      E::G1Affine,        // [α]₁
  beta_g1:       E::G1Affine,        // [β]₁ (C 계산용)
  beta_g2:       E::G2Affine,        // [β]₂ (B 계산용)
  delta_g1:      E::G1Affine,        // [δ]₁ (블라인딩)
  delta_g2:      E::G2Affine,        // [δ]₂ (블라인딩)
  a_query:       Vec<E::G1Affine>,   // [aⱼ(τ)]₁
  b_g1_query:    Vec<E::G1Affine>,   // [bⱼ(τ)]₁
  b_g2_query:    Vec<E::G2Affine>,   // [bⱼ(τ)]₂
  h_query:       Vec<E::G1Affine>,   // [τⁱt(τ)/δ]₁
  l_query:       Vec<E::G1Affine>,   // [lcⱼ/δ]₁ (private)
}`;

export const VERIFYING_KEY_CODE = `struct VerifyingKey<E: Pairing> {
  alpha_g1:  E::G1Affine,       // [α]₁
  beta_g2:   E::G2Affine,       // [β]₂
  gamma_g2:  E::G2Affine,       // [γ]₂
  delta_g2:  E::G2Affine,       // [δ]₂
  ic:        Vec<E::G1Affine>,  // [lcⱼ/γ]₁ (public)
}
// PreparedVerifyingKey: e(α,β) 사전 계산 포함`;

export const PROOF_CODE = `struct Proof<E: Pairing> {
  a: E::G1Affine,   // A ∈ G1 — 64 bytes (BN254)
  b: E::G2Affine,   // B ∈ G2 — 128 bytes (BN254)
  c: E::G1Affine,   // C ∈ G1 — 64 bytes (BN254)
}
// 총 256 bytes — 회로 크기에 무관한 상수 크기`;
