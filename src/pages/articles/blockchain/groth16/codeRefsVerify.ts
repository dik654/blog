import type { CodeRef } from './codeRefsTypes';

export const verifyCodeRefs: Record<string, CodeRef> = {
  'groth16-verify': {
    path: 'arkworks-rs/groth16/src/verifier.rs',
    lang: 'rust',
    highlight: [1, 28],
    desc:
`verify_proof()는 페어링 3회로 Groth16 증명을 검증합니다.

검증식: e(A, B) == e(α, β) · e(IC_sum, γ) · e(C, δ)

1. IC_sum = IC₀ + Σ xᵢ·ICᵢ (공개 입력의 MSM — 유일한 O(l) 연산)
2. 4개 입력으로 multi_pairing → 결과가 identity이면 성공

온체인 검증 비용: BN254 precompile 기준 ~230k gas (Ethereum).`,
    code: `pub fn verify_proof<E: Pairing>(
    pvk: &PreparedVerifyingKey<E>,
    proof: &Proof<E>,
    public_inputs: &[E::ScalarField],
) -> Result<bool, SynthesisError> {
    // 1. IC accumulation: IC₀ + Σ xᵢ · ICᵢ
    let mut g_ic = pvk.vk.gamma_abc_g1[0].into_group();
    for (i, input) in public_inputs.iter().enumerate() {
        g_ic += pvk.vk.gamma_abc_g1[i + 1] * input;
    }

    // 2. Pairing check:
    //    e(A, B) == e(α, β) · e(IC_sum, γ) · e(C, δ)
    //    ⟺ e(A, B) · e(-α, β) · e(-IC_sum, γ) · e(-C, δ) == 1
    let result = E::multi_pairing(
        [
            E::G1Prepared::from(proof.a),
            E::G1Prepared::from(-pvk.vk.alpha_g1),
            E::G1Prepared::from(-g_ic.into_affine()),
            E::G1Prepared::from(-proof.c),
        ],
        [
            E::G2Prepared::from(proof.b),
            E::G2Prepared::from(pvk.vk.beta_g2),
            E::G2Prepared::from(pvk.vk.gamma_g2),
            E::G2Prepared::from(pvk.vk.delta_g2),
        ],
    );
    Ok(result.is_zero())
}`,
    annotations: [
      { lines: [6, 9], color: 'sky', note: 'IC_sum 계산: IC₀ + Σ xᵢ·ICᵢ — 공개 입력의 선형 결합' },
      { lines: [12, 14], color: 'emerald', note: '검증식을 곱셈 형태로 변환 → product = 1 체크' },
      { lines: [15, 27], color: 'amber', note: 'multi_pairing: 4개 (G1, G2) 쌍으로 한 번에 계산' },
      { lines: [28, 28], color: 'violet', note: 'is_zero(): 곱이 identity이면 증명 유효' },
    ],
  },

};
