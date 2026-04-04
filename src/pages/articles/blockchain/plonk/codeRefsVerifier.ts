import type { CodeRef } from './codeRefsTypes';

export const verifierCodeRefs: Record<string, CodeRef> = {
  'plonk-verifier': {
    path: 'ZK-Garage/plonk/src/proof_system/verifier.rs',
    lang: 'rust',
    highlight: [1, 30],
    desc:
`PLONK Verifier는 증명의 모든 commitment와 evaluation으로 검증합니다.

1. Fiat-Shamir로 β,γ,α,ζ,v를 재생성
2. 평가값으로 linearised commitment [r]₁ 사전 계산
3. batch KZG verify — 2회 페어링으로 완료

회로 크기 n에 무관한 O(1) 검증입니다 (G1 스칼라 곱 소수 + 페어링 2회).`,
    code: `pub fn verify(
    &self,
    verifier_key: &VerifierKey,
    proof: &Proof,
    public_inputs: &[BlsScalar],
    transcript: &mut Transcript,
) -> Result<(), Error> {
    // 1. Fiat-Shamir 챌린지 재생성
    transcript.append_commitments(&[proof.a_comm, proof.b_comm, proof.c_comm]);
    let beta = transcript.challenge_scalar(b"beta");
    let gamma = transcript.challenge_scalar(b"gamma");
    transcript.append_commitment(&proof.z_comm);
    let alpha = transcript.challenge_scalar(b"alpha");
    let zeta = transcript.challenge_scalar(b"zeta");

    // 2. Linearised commitment 계산 (from evaluations)
    let r_comm = self.compute_linearisation_commitment(
        verifier_key, proof,
        &alpha, &beta, &gamma, &zeta,
    );

    // 3. Batch KZG verify — 2 pairings
    let ok = self.batch_verify_opening(
        &proof.w_zeta_comm,
        &proof.w_zeta_omega_comm,
        &r_comm,
        &zeta,
        verifier_key,
    );
    if !ok { return Err(Error::ProofVerificationError); }
    Ok(())
}`,
    annotations: [
      { lines: [8, 14], color: 'sky', note: 'Fiat-Shamir 재생성 — 증명자와 동일한 β,γ,α,ζ 도출' },
      { lines: [16, 20], color: 'emerald', note: 'Linearised commitment 재구성 — 평가값으로 G1 연산' },
      { lines: [22, 30], color: 'amber', note: 'Batch KZG verify — W_ζ, W_{ζω} 페어링 2회로 검증' },
    ],
  },
};
