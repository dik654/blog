import type { CodeRef } from './codeRefsTypes';

export const kzgVerifyCodeRefs: Record<string, CodeRef> = {
  'kzg-verify': {
    path: 'jellyfish/primitives/src/pcs/univariate_kzg/mod.rs',
    lang: 'rust',
    highlight: [1, 20],
    desc:
`verify()는 페어링 등식으로 commitment 검증을 완료합니다.

검증식: e(C - [v]₁, [1]₂) == e(π, [τ - z]₂)
        ⟺ e(C - [v]₁, h) == e(π, beta_h - [z]₂·h)

페어링 2회로 O(1) 검증이 가능합니다.
다항식 전체를 보지 않고 commitment의 정당성을 확인합니다.`,
    code: `fn verify(
    verifier_param: &Self::VerifierParam,
    commitment: &Self::Commitment,
    point: &E::ScalarField,
    value: &E::ScalarField,
    proof: &Self::Proof,
) -> Result<bool, PCSError> {
    let pairing_inputs: Vec<(E::G1Prepared, E::G2Prepared)> = vec![
        // e(C - [v]₁, h)
        (
            (commitment.0.into_group() - E::G1::generator() * value)
                .into_affine()
                .into(),
            verifier_param.h.into(),
        ),
        // e(-π, [τ]₂ - [z]₂)
        (
            (-proof.0.into_group()).into_affine().into(),
            (verifier_param.beta_h.into_group()
                - verifier_param.h * point)
                .into_affine()
                .into(),
        ),
    ];
    Ok(E::multi_pairing(pairing_inputs) == PairingOutput::zero())
}`,
    annotations: [
      { lines: [1, 7], color: 'sky', note: 'verify() — commitment, point, value, proof를 받아 검증' },
      { lines: [9, 15], color: 'emerald', note: '첫 번째 페어링 입력: e(C - [v]₁, h)' },
      { lines: [17, 23], color: 'amber', note: '두 번째 페어링 입력: e(-π, [τ]₂ - [z]₂)' },
      { lines: [25, 25], color: 'violet', note: 'multi_pairing 결과가 0이면 검증 성공' },
    ],
  },
};
