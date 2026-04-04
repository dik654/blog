import type { CodeRef } from './codeRefsTypes';

export const preparedVkCodeRefs: Record<string, CodeRef> = {
  'groth16-prepared-vk': {
    path: 'arkworks-rs/groth16/src/data_structures.rs',
    lang: 'rust',
    highlight: [1, 22],
    desc:
`PreparedVerifyingKey는 검증 최적화를 위한 사전 계산 구조체입니다.

beta_g2_neg, gamma_g2_neg, delta_g2_neg:
  G2 점의 negation을 미리 계산해두면 매 검증마다 부정 연산을 생략합니다.

alpha_g1_beta_g2:
  e(α, β)를 사전 계산하여 PairingOutput으로 캐싱합니다.
  이 값은 모든 검증에서 동일하므로 한 번만 계산하면 됩니다.`,
    code: `/// Preprocessed verification key for faster verification.
#[derive(Clone, Debug)]
pub struct PreparedVerifyingKey<E: Pairing> {
    pub vk: VerifyingKey<E>,
    /// e(α, β) — 사전 계산된 페어링 값
    pub alpha_g1_beta_g2: E::TargetField,
    /// -[β]₂ prepared
    pub beta_g2_neg_prepared: E::G2Prepared,
    /// -[γ]₂ prepared
    pub gamma_g2_neg_prepared: E::G2Prepared,
    /// -[δ]₂ prepared
    pub delta_g2_neg_prepared: E::G2Prepared,
}

impl<E: Pairing> From<VerifyingKey<E>> for PreparedVerifyingKey<E> {
    fn from(vk: VerifyingKey<E>) -> Self {
        let alpha_g1_beta_g2 = E::pairing(vk.alpha_g1, vk.beta_g2);
        Self {
            beta_g2_neg_prepared:  E::G2Prepared::from(-vk.beta_g2),
            gamma_g2_neg_prepared: E::G2Prepared::from(-vk.gamma_g2),
            delta_g2_neg_prepared: E::G2Prepared::from(-vk.delta_g2),
            alpha_g1_beta_g2: alpha_g1_beta_g2.0,
            vk,
        }
    }
}`,
    annotations: [
      { lines: [5, 6], color: 'sky', note: 'e(α, β) 사전 계산 — 모든 검증에서 재사용' },
      { lines: [7, 12], color: 'emerald', note: 'G2 negation 사전 계산 — 검증 시 부정 연산 절약' },
      { lines: [17, 17], color: 'amber', note: 'pairing(α, β) — 1회 계산 후 캐싱' },
      { lines: [19, 21], color: 'violet', note: 'G2Prepared::from(-g2) — Miller loop 최적화용 전처리' },
    ],
  },
};
