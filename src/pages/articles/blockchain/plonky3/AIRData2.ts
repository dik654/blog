export const quotientProverCode = `// uni-stark/src/prover.rs — STARK 증명 핵심 단계

pub fn prove_with_preprocessed<SC, A>(
    config: &SC, air: &A,
    trace: RowMajorMatrix<Val<SC>>,
    public_values: &[Val<SC>],
    preprocessed: Option<&PreprocessedProverData<SC>>,
) -> Proof<SC>
{
    let degree = trace.height();      // 행 수 = 실행 단계 수 N
    let log_degree = log2_strict_usize(degree);  // n = log2(N)

    // 1. 트레이스 커밋: Merkle 트리에 평가값 저장
    let (trace_commit, trace_data) = pcs.commit(
        iter::once((trace_domain, RowMajorMatrixCow::Owned(trace)))
    );
    challenger.observe(trace_commit.clone());  // Fiat-Shamir에 관찰

    // 2. 랜덤 도전값 샘플링 (확장체 원소)
    let alpha: SC::Challenge = challenger.sample_ext_element();

    // 3. 제약 평가 → 몫 다항식 Q(x) 계산
    //    C(T(x), T(hx)) = Z(x) * Q(x)  where Z(x) = x^N - 1 (소거 다항식)
    let quotient_values = quotient_values::<SC, A, _>(
        config, air, &trace_domain, trace_lde, &public_values,
        alpha, &preprocessed
    );

    // 4. Q(x) 커밋 → 검증자에게 전송
    let (quotient_commit, quotient_data) = pcs.commit(
        zip(quotient_chunks_domains, quotient_chunks)
            .map(|(domain, values)| (domain, RowMajorMatrixCow::Owned(values)))
    );

    // 5. zeta 지점에서 개구 (polynomial opening)
    let zeta: SC::Challenge = challenger.sample_ext_element();
    // T(zeta), T(h*zeta), Q(zeta) 평가 후 FRI 증명 생성
    let opening_proof = pcs.open(rounds, &mut challenger);
}`;
