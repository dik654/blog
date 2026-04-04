export const BATCHED_CODE = `// jolt-core/src/subprotocols/sumcheck.rs

pub fn prove<F, T>(
    mut sumcheck_instances: Vec<&mut dyn SumcheckInstanceProver<F, T>>,
    opening_accumulator: &mut ProverOpeningAccumulator<F>,
    transcript: &mut T,
) -> (ClearSumcheckProof, Vec<F::Challenge>, F)
{
    // 1. 각 인스턴스의 초기 클레임을 트랜스크립트에 기록
    sumcheck_instances.iter().for_each(|sc| {
        transcript.append_scalar(b"sumcheck_claim", &sc.input_claim(opening_accumulator));
    });

    // 2. 배치 계수 α_i 샘플링 (Fiat-Shamir)
    let batching_coeffs: Vec<F> = transcript.challenge_vector(instances.len());

    // 3. 개별 클레임 스케일링 (라운드 수 차이 보정)
    //    max_rounds = max(num_rounds_i)
    //    scaled_claim_i = claim_i * 2^(max_rounds - rounds_i)

    // 4. 초기 배치 클레임: Σ α_i * scaled_claim_i
    let initial_batched_claim: F = claims.zip(coeffs).map(|(c, a)| c * a).sum();

    // 5. max_rounds 번 반복:
    //    각 인스턴스가 라운드별 단변수 다항식 g_i(X_j) 계산
    //    배치: g(X_j) = Σ α_i * g_i(X_j)
    //    도전값 r_j = transcript.challenge_scalar()
    //    각 인스턴스에 r_j를 바인딩 → 다음 라운드로
    for round in 0..max_rounds { ... }

    // 결과: 최종 평가 클레임, 도전값 벡터 r_sumcheck
}`;

export const STAGE1_CODE = `// jolt-core/src/zkvm/prover.rs — prove_stage1

// Spartan: R1CS를 Sumcheck로 환원
// 제약 행렬 A, B, C에 대해:
//   Σ_x eq(τ, x) * (A·z(x) * B·z(x) - C·z(x)) = 0
// z = [공개 입력 || 증인 || 상수 1] 벡터

// UniSkip 최적화 (uni_skip/):
//   첫 번째 라운드를 단변수 다항식으로 처리 (약 16× 속도 개선)
let uni_skip_params = OuterUniSkipParams::new(&self.spartan_key, &mut self.transcript);
let first_round_proof = self.prove_uniskip(&mut uni_skip);

// 나머지 라운드: 스트리밍 Sumcheck
let mut spartan_outer_remaining = OuterRemainingStreamingSumcheck::new(...);
let (sumcheck_proof, r_stage1, _) = self.prove_batched_sumcheck(vec![
    &mut spartan_outer_remaining,
]);`;

export const STAGE2_CODE = `// jolt-core/src/zkvm/prover.rs — prove_stage2

// 5개 Sumcheck를 동시에 배치:
let instances: Vec<Box<dyn SumcheckInstanceProver>> = vec![
    Box::new(RamReadWriteCheckingProver::initialize(..)),
    //   RAM 읽기/쓰기: 멀티셋 동등성 (Lasso 오프라인 메모리 검사)
    Box::new(ProductVirtualRemainderProver::initialize(..)),
    //   가상 명령어 그랜드 프로덕트
    Box::new(InstructionLookupsClaimReductionSumcheckProver::initialize(..)),
    //   Lasso 룩업 클레임 감소: 희소 MLE → 서브테이블 클레임
    Box::new(RamRafEvaluationSumcheckProver::initialize(..)),
    //   RAF(Read-And-Forget) 평가: 메모리 정확성
    Box::new(OutputSumcheckProver::initialize(..)),
    //   최종 메모리 상태 검사
];
let (sumcheck_proof, r_stage2, _) = self.prove_batched_sumcheck(instances);

// Stage 3~7: 나머지 클레임 감소 및 서브테이블 평가
// Stage 8: Dory PCS로 모든 다변량 개구 증명 통합
// → joint_opening_proof: 단일 증명으로 모든 평가 클레임 입증`;
