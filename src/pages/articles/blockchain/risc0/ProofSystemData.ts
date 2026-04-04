export const RECURSION_CODE = `// 재귀 회로: STARK 검증기를 다시 zkVM으로 증명
// → "STARK 검증이 통과했다"를 더 작은 STARK으로 증명

// 1. 세그먼트별 STARK 생성
let segment_receipts: Vec<SegmentReceipt> = segments
    .par_iter()  // 병렬 처리!
    .map(|seg| prover.prove_segment(seg))
    .collect();

// 2. 재귀 압축: SegmentReceipt → SuccinctReceipt
let succinct = prover.compress(&composite_receipt)?;
// 재귀 회로가 각 SegmentReceipt를 검증하고
// "모두 통과했다"를 하나의 STARK으로 증명

// 3. STARK → SNARK (온체인 검증용)
let groth16 = prover.identity_p254(succinct)?;
// BN254 기반 Groth16: 이더리움 EVM에서 검증 가능
// 가스 비용 ~280,000 gas (pairing 연산)`;

export const STARK_CODE = `// RISC-V 실행 추적 → 다항식 → FRI 증명

// 1. Arithmetization: 실행 추적을 다항식으로 인코딩
// RV32IM 회로: 각 명령어 타입별 커스텀 게이트
// 레지스터/메모리 접근 → 다항식 제약

// 2. Commitment: FRI (Fast Reed-Solomon IOP)
// 다항식을 Reed-Solomon 인코딩 → Merkle 트리 커밋
// 투명 셋업 (신뢰 셋업 불필요)

// 3. Query Phase: 랜덤 포인트에서 평가 요청
// Fiat-Shamir 변환으로 비대화형화

// 증명 크기 vs 보안 레벨
// 128-bit 보안: ~200KB (STARK, 세그먼트당)
// Groth16 압축 후: ~200바이트 (고정 크기)

// 검증 시간
// STARK: ~100ms (로컬)
// Groth16 온체인: ~2ms + 가스 비용`;

export const BONSAI_CODE = `// 로컬 증명 대신 Bonsai API 사용
// → GPU 클러스터에서 빠른 증명 생성

use risc0_zkvm::ProverOpts;

// 환경 변수로 Bonsai 선택
// BONSAI_API_KEY=xxx BONSAI_API_URL=https://api.bonsai.xyz

let receipt = if std::env::var("BONSAI_API_KEY").is_ok() {
    // 클라우드 증명 (몇 초)
    bonsai_sdk::prove(elf, input).await?
} else {
    // 로컬 증명 (몇 분)
    default_prover().prove(env, elf)?
};`;
