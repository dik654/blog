import type { CodeRef } from '@/components/code/types';

export const verifyCodeRefs: Record<string, CodeRef> = {
  'groth16-verify': {
    path: 'groth16.rs — verify()',
    lang: 'rust',
    highlight: [1, 24],
    desc: '검증 방정식: e(A,B) = e(α,β) · e(IC_sum,[γ]₂) · e(C,[δ]₂)\n페어링 3개만으로 완료.\n증명 크기 무관, 항상 O(1) 검증.',
    code: `pub fn verify(
    vk: &VerifyingKey,
    public_inputs: &[Fr],
    proof: &Proof,
) -> bool {
    assert_eq!(
        public_inputs.len() + 1, vk.ic.len());

    // 1. IC_sum = ic[0] + Σ pub[j]·ic[j+1]
    let mut ic_sum = vk.ic[0]; // One 변수
    for (j, &input) in
        public_inputs.iter().enumerate()
    {
        if !input.is_zero() {
            ic_sum = ic_sum
                + vk.ic[j + 1]
                    .scalar_mul(&input.to_repr());
        }
    }

    // 2. e(A,B) =? e(α,β)·e(IC_sum,[γ]₂)·e(C,[δ]₂)
    let lhs = pairing(&proof.a, &proof.b);
    let rhs = vk.alpha_beta_gt
        * pairing(&ic_sum, &vk.gamma_g2)
        * pairing(&proof.c, &vk.delta_g2);

    lhs == rhs
}`,
    annotations: [
      { lines: [9, 18], color: 'sky', note: 'IC_sum — 공개 입력으로 ic 벡터를 MSM 결합' },
      { lines: [21, 25], color: 'emerald', note: '3개 페어링: LHS 1개 + RHS 2개 (α,β는 사전계산)' },
      { lines: [27, 27], color: 'amber', note: 'Fp12 비교 — 페어링 결과가 일치하면 증명 유효' },
    ],
  },
  'groth16-proof': {
    path: 'groth16.rs — Proof struct',
    lang: 'rust',
    highlight: [1, 10],
    desc: 'Groth16 증명 = 커브 포인트 3개.\nBN254: G1=64B, G2=128B → 총 256바이트.',
    code: `/// 증명: 3개의 커브 포인트
/// BN254: G1=2x32B, G2=2x64B
/// 총 크기: 64 + 128 + 64 = 256바이트
pub struct Proof {
    pub a: G1,  // A ∈ G1 (64 bytes)
    pub b: G2,  // B ∈ G2 (128 bytes)
    pub c: G1,  // C ∈ G1 (64 bytes)
}`,
    annotations: [
      { lines: [5, 5], color: 'sky', note: 'A ∈ G1 — α + QAP A항 + rδ 블라인딩' },
      { lines: [6, 6], color: 'emerald', note: 'B ∈ G2 — β + QAP B항 + sδ 블라인딩' },
      { lines: [7, 7], color: 'amber', note: 'C ∈ G1 — private + h·t + 교차 블라인딩' },
    ],
  },
};
