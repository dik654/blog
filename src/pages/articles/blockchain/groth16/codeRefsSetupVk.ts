import type { CodeRef } from './codeRefsTypes';

export const setupVkCodeRefs: Record<string, CodeRef> = {
  'groth16-vk': {
    path: 'arkworks-rs/groth16/src/data_structures.rs',
    lang: 'rust',
    highlight: [1, 22],
    desc:
`VerifyingKey는 검증자가 증명을 확인하는 데 필요한 모든 정보를 담습니다.

alpha_g1, beta_g2: 구조적 태그 — QAP 구조 강제
gamma_g2, delta_g2: public/private 분리 — IC는 γ, L은 δ로 나눔
gamma_abc_g1: IC 벡터 — 공개 입력의 선형 결합 기저점들`,
    code: `/// Groth16 Verifying Key
#[derive(Clone, Debug, CanonicalSerialize, CanonicalDeserialize)]
pub struct VerifyingKey<E: Pairing> {
    /// [α]₁ — 구조적 일관성 태그
    pub alpha_g1: E::G1Affine,
    /// [β]₂ — α와 쌍으로 QAP 구조 강제
    pub beta_g2: E::G2Affine,
    /// [γ]₂ — 공개 입력 채널
    pub gamma_g2: E::G2Affine,
    /// [δ]₂ — 비공개 witness 채널
    pub delta_g2: E::G2Affine,
    /// IC: [(β·uᵢ(τ) + α·vᵢ(τ) + wᵢ(τ))/γ]₁  for i = 0..l
    pub gamma_abc_g1: Vec<E::G1Affine>,
}

/// Groth16 Proof — G1 2개 + G2 1개 = 256 bytes (BN254)
#[derive(Clone, Debug, CanonicalSerialize, CanonicalDeserialize)]
pub struct Proof<E: Pairing> {
    pub a: E::G1Affine,
    pub b: E::G2Affine,
    pub c: E::G1Affine,
}`,
    annotations: [
      { lines: [4, 7], color: 'sky', note: 'alpha_g1, beta_g2 — e(α,β) 페어링으로 QAP 구조 검증' },
      { lines: [8, 11], color: 'emerald', note: 'gamma_g2, delta_g2 — 공개/비공개 분리 채널' },
      { lines: [12, 13], color: 'amber', note: 'IC 벡터 — 검증자가 공개 입력으로 IC_sum 계산' },
      { lines: [16, 21], color: 'violet', note: 'Proof 구조체 — 단 3개 원소로 간결한 증명' },
    ],
  },
};
