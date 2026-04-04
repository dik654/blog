export const PROVE_CODE = `// uni-stark/src/prover.rs — prove() 함수
pub fn prove<SC, A>(config: &SC, air: &A,
    trace: RowMajorMatrix<Val<SC>>, public_values: &Vec<Val<SC>>,
) -> Proof<SC> {
    // 1. 트레이스 커밋 (DFT → LDE → Merkle)
    let (trace_commit, trace_data) = pcs.commit([(trace_domain, trace)]);
    challenger.observe(trace_commit.clone());

    // 2. 챌린지 샘플링
    let alpha: SC::Challenge = challenger.sample_algebra_element();

    // 3. Quotient polynomial 계산
    let quotient_values = quotient_values(
        air, public_values, trace_domain, quotient_domain,
        trace_on_quotient_domain, alpha, constraint_count,
    );

    // 4. Quotient 커밋
    let (quotient_commit, quotient_data) = pcs.commit_quotient(
        quotient_domain, quotient_flat, quotient_degree);

    // 5. 개구 증명 (FRI)
    let zeta = challenger.sample_algebra_element();
    let (opened_values, opening_proof) = pcs.open(rounds, &mut challenger);
    Proof { commitments, opened_values, opening_proof, degree_bits }
}`;

export const PROVE_ANNOTATIONS = [
  { lines: [5, 7] as [number, number], color: 'sky' as const, note: '1단계: 트레이스 DFT + Merkle 커밋' },
  { lines: [13, 17] as [number, number], color: 'emerald' as const, note: '3단계: 몫 다항식 Q(x) = C(x)/Z_H(x)' },
  { lines: [22, 24] as [number, number], color: 'amber' as const, note: '5단계: FRI 기반 개구 증명' },
];

export const VERIFY_CODE = `// uni-stark/src/verifier.rs — verify() 함수
pub fn verify<SC, A>(config: &SC, air: &A, proof: &Proof<SC>,
    public_values: &Vec<Val<SC>>,
) -> Result<(), VerificationError> {
    // 1. 트랜스크립트 재구성 (Fiat-Shamir)
    challenger.observe(commitments.trace.clone());
    challenger.observe_slice(public_values);
    let alpha = challenger.sample_algebra_element();
    let zeta = challenger.sample_algebra_element();

    // 2. 개방 증명 검증 (FRI + Merkle)
    pcs.verify(coms_to_verify, opening_proof, &mut challenger)?;

    // 3. 제약조건 검증: C(zeta) / Z_H(zeta) == Q(zeta)
    let mut folder = VerifierConstraintFolder { main, alpha, .. };
    air.eval(&mut folder);
    let folded = folder.accumulator;
    if folded * sels.inv_vanishing != quotient {
        return Err(VerificationError::OodEvaluationMismatch);
    }
    Ok(())
}`;

export const VERIFY_ANNOTATIONS = [
  { lines: [6, 9] as [number, number], color: 'sky' as const, note: 'Fiat-Shamir 트랜스크립트 재현' },
  { lines: [12, 12] as [number, number], color: 'emerald' as const, note: 'FRI + Merkle 경로 검증' },
  { lines: [15, 20] as [number, number], color: 'amber' as const, note: '제약 검증: C(z)/Z_H(z) = Q(z)' },
];
