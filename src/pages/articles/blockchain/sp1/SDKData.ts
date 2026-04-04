export const PROOF_TYPE_CODE = `use sp1_sdk::{ProverClient, ProofMode, SP1Stdin};

let client = ProverClient::from_env();
let (pk, vk) = client.setup(ELF);
let stdin = SP1Stdin::new();

// 1. Core STARK (개발/테스트용, 크기 큼)
let proof = client.prove(&pk, &stdin).run()?;

// 2. Compressed STARK (재귀 압축, 중간 크기)
let proof = client.prove(&pk, &stdin).compressed().run()?;

// 3. Groth16 SNARK (이더리움 온체인 검증용, ~256바이트)
let proof = client.prove(&pk, &stdin).groth16().run()?;

// 4. PLONK SNARK (이더리움 온체인, Groth16보다 약간 큼)
let proof = client.prove(&pk, &stdin).plonk().run()?;

// 검증 (로컬)
client.verify(&proof, &vk)?;`;

export const PIPELINE_CODE = `// Core Proof → Compress → Shrink → Wrap → Groth16
// 각 단계는 이전 단계의 증명을 재귀적으로 검증하는 zkVM 프로그램

// 단계 1: Core — 세그먼트별 BabyBear STARK
let core_proofs: Vec<SP1CoreProof> = shards
    .par_iter()
    .map(|shard| prover.prove_core(shard))
    .collect();

// 단계 2: Compress — 세그먼트들을 BabyBear STARK로 압축
let compressed = prover.compress(&core_proofs)?;
// "모든 Core Proof가 유효하다"를 하나의 STARK으로 표현

// 단계 3: Shrink — BabyBear → BN254 스칼라체로 변환
let shrunk = prover.shrink(&compressed)?;
// FRI를 BN254 STARK로 재증명 (Groth16 검증을 위한 준비)

// 단계 4: Wrap — BN254 STARK를 Groth16 회로 입력으로 래핑
let wrapped = prover.wrap_bn254(&shrunk)?;

// 단계 5: Groth16 — 최종 SNARK 생성 (신뢰 셋업 필요)
let groth16 = prover.wrap_groth16_bn254(wrapped, &build_dir)?;
// → 192바이트 고정, 이더리움 온체인에서 ~300k gas로 검증
// (PLONK의 경우 ~500k gas)`;

export const SOLIDITY_CODE = `// 이더리움에서 SP1 증명 검증
interface ISP1Verifier {
    function verifyProof(
        bytes32 programVKey,     // 프로그램 검증 키 해시
        bytes calldata publicValues, // Journal (공개 출력)
        bytes calldata proofBytes    // Groth16 or PLONK 증명
    ) external view;
}

// 앱 컨트랙트
contract MyApp {
    ISP1Verifier public verifier;
    bytes32 public programVKey;

    function submitResult(
        bytes calldata publicValues,
        bytes calldata proofBytes
    ) external {
        verifier.verifyProof(programVKey, publicValues, proofBytes);
        (uint256 result) = abi.decode(publicValues, (uint256));
        // 검증 완료 — 결과 사용
    }
}`;

export const PROVER_NETWORK_CODE = `// 환경 변수로 Succinct Prover Network 사용
// SP1_PROVER=network SP1_PRIVATE_KEY=xxx

let client = ProverClient::from_env();
// → env에 network 설정 시 자동으로 클라우드 증명
// → GPU 클러스터 활용, 수 초~분 내 증명 완료

// 로컬 vs 네트워크 비교
// CPU 로컬: ~수십 분 (복잡한 프로그램)
// GPU 로컬: ~수 분
// Prover Network: ~수십 초 (분산 GPU)`;
