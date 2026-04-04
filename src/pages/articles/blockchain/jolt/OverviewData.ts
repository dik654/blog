export const CRATE_CODE = `// jolt-core/src/
zkvm/
  prover.rs         // JoltCpuProver — 8단계 Sumcheck 파이프라인
  verifier.rs       // JoltVerifier
  proof_serialization.rs // JoltProof<F, C, PCS, FS> 구조체
  instruction/mod.rs    // InstructionLookup, CircuitFlags
  lookup_table/mod.rs   // LookupTables<XLEN>: AND, XOR, RangeCheck 등
  spartan/          // Spartan Outer/Product Sumcheck (R1CS 검증)
  r1cs/             // UniformSpartanKey (균등 R1CS 키)
  ram/              // RAM 읽기/쓰기 검사 (Lasso 기반)
subprotocols/
  sumcheck.rs       // BatchedSumcheck — 병렬 Sumcheck 배치
  sumcheck_prover.rs// SumcheckInstanceProver 트레이트
poly/
  commitment/dory/  // DoryCommitmentScheme (다변량 다항식 커밋)
  multilinear_polynomial.rs

// 기본 설정 (zkvm/mod.rs):
pub type RV64IMACProver<'a>  = JoltCpuProver<'a,  Fr, Bn254Curve, DoryCommitmentScheme, ...>
pub type RV64IMACProof       = JoltProof<Fr, Bn254Curve, DoryCommitmentScheme, ...>
// → BN254 스칼라체, Dory PCS (비신뢰 셋업), Blake2b 트랜스크립트`;

export const LASSO_CODE = `// jolt-core/src/zkvm/lookup_table/mod.rs

// LookupTables: RISC-V 명령어를 테이블 룩업으로 분해
pub enum LookupTables<const XLEN: usize> {
    And(AndTable),           // AND 연산
    Or(OrTable),             // OR 연산
    Xor(XorTable),           // XOR 연산
    RangeCheck(RangeCheckTable), // 부호/범위 비교
    Equal(EqualTable),       // 동등 비교
    UnsignedGreaterThanEqual(..),
    VirtualXORROT32(..),     // 가상 명령어 (다중 룩업 조합)
    // ... ~30종 테이블
}

// PrefixSuffixDecomposition: 큰 룩업을 8비트 부분 테이블로 분해
// 64비트 AND(x, y) → AND(x_hi, y_hi) || AND(x_lo, y_lo)
// → 희소 표현: 트레이스에서 실제로 사용한 항목만 MLE(다선형 확장)에 포함

// InstructionLookup 트레이트:
// fn lookup_table(&self) -> Option<LookupTables>
// fn to_lookup_index(&self) -> u128  // interleave_bits(x, y) → 단일 인덱스
// fn to_lookup_output(&self) -> u64  // 실행 결과`;

export const PROOF_CODE = `// jolt-core/src/zkvm/proof_serialization.rs

pub struct JoltProof<F, C, PCS, FS> {
    pub commitments: Vec<PCS::Commitment>, // Dory 다변량 커밋
    // Stage 1: Spartan Outer Sumcheck (R1CS 외부 인수)
    pub stage1_uni_skip_first_round_proof: UniSkipFirstRoundProofVariant,
    pub stage1_sumcheck_proof: SumcheckInstanceProof,
    // Stage 2: RAM/Instruction/Product 결합 Sumcheck
    pub stage2_uni_skip_first_round_proof: UniSkipFirstRoundProofVariant,
    pub stage2_sumcheck_proof: SumcheckInstanceProof,
    // Stage 3~7: 명령어/RAM/레지스터/바이트코드/출력 검사
    pub stage3_sumcheck_proof: SumcheckInstanceProof,
    // ...
    pub stage7_sumcheck_proof: SumcheckInstanceProof,
    // 공동 개구 증명
    pub joint_opening_proof: PCS::Proof,
    pub trace_length: usize,
}`;
