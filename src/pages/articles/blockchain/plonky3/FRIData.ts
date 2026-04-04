export const friProverCode = `// fri/src/prover.rs — prove_fri (실제 코드 기반)

pub fn prove_fri<Folding, Val, Challenge, InputMmcs, FriMmcs, Challenger>(
    folding: &Folding,
    params: &FriParameters<FriMmcs>,   // log_blowup, num_queries, pow_bits
    inputs: Vec<Vec<Challenge>>,        // 감소하는 길이 순 정렬된 다항식 평가값
    challenger: &mut Challenger,
    log_global_max_height: usize,
    prover_data: &[ProverDataWithOpeningPoints<...>],
    input_mmcs: &InputMmcs,
) -> FriProof<...>
{
    // --- 커밋 단계 (Commit Phase) ---
    // 각 라운드에서 절반씩 접기: f(x) → f_fold(x^2)
    // FRI folding: f_fold(x) = (f(x) + f(-x)) / 2 + beta * (f(x) - f(-x)) / (2x)
    // beta는 Fiat-Shamir 채린저에서 샘플링
    let commit_phase_result = commit_phase(folding, params, inputs, challenger);

    // 선택된 folding arity를 트랜스크립트에 기록
    for &log_arity in &commit_phase_result.log_arities {
        challenger.observe(Val::from_usize(log_arity));
    }

    // --- PoW (그라인딩) ---
    // 검증자가 쉽게 grinding 공격을 못 하도록 작업 증명 추가
    let pow_witness = challenger.grind(params.proof_of_work_bits);

    // --- 쿼리 단계 (Query Phase) ---
    // num_queries개 인덱스를 샘플링하여 각각 열기 증명 생성
    // 보안 오류율: rate^{num_queries} (Reed-Solomon proximity gap)
    let query_proofs = iter::repeat_with(|| {
        let index = challenger.sample_bits(log_max_height + folding.extra_query_index_bits());
        QueryProof {
            // 입력 다항식 열기 (Merkle 증명)
            input_proof: open_input(log_global_max_height, index, prover_data, input_mmcs),
            // 각 FRI 라운드에서 folding 일관성 증명
            commit_phase_openings: answer_query(params, &log_arities, &data, index),
        }
    }).take(params.num_queries).collect();
}`;

export const twoAdicPcsCode = `// fri/src/two_adic_pcs.rs

/// FRI를 이용한 다항식 커밋 스킴
/// f(x)를 coset gH 위의 평가값으로 커밋하고
/// 임의 지점 zeta에서의 개구(opening) f(zeta)를 증명
pub struct TwoAdicFriPcs<Val, Dft, InputMmcs, FriMmcs> {
    dft:  Dft,        // 이산 푸리에 변환 (Radix-2)
    mmcs: InputMmcs,  // 입력 트리 (Merkle)
    fri:  FriParameters<FriMmcs>,
}

// 개구 증명의 핵심 아이디어:
// f(zeta) = v를 증명하려면 quotient q(x) = (f(x) - v) / (x - zeta)가
// 저차 다항식임을 FRI로 증명
// → f의 degree < N이면 q의 degree < N-1

// TwoAdicFriFolding: f(x) → f_half(x) 접기 구현
// 표준 FRI: f_half(x^2) = (f(x) + f(-x))/2 + beta*(f(x)-f(-x))/(2x)
// Plonky3: coset shift를 제거해 모든 다항식을 subgroup H 위로 통일
// → g*H coset의 평가값을 G(x)=F(gx)로 재해석 (two_adic_pcs.rs 주석 참고)

impl<...> Pcs<Challenge, Challenger> for TwoAdicFriPcs<...> {
    // commit: 트레이스 행렬 → DFT → low-rate 평가 확장 → Merkle 트리
    fn commit(&self, polynomials) -> (Commitment, ProverData) { ... }

    // open: 여러 지점에서 동시 개구
    // 1. 모든 다항식을 alpha로 선형 결합 (batching)
    // 2. 결합된 quotient에 FRI 적용
    fn open(&self, rounds, challenger) -> (OpenedValues, Proof) { ... }

    // verify: FRI 증명 + Merkle 경로 검증
    fn verify(&self, ...) -> Result<(), Error> { ... }
}`;

