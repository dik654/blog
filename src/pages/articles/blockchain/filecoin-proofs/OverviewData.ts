export const REPO_CODE = `// rust-fil-proofs 크레이트 맵
storage-proofs-core/         ← 공통 타입 (Merkle, 그래프, 해시)
storage-proofs-porep/        ← PoRep (Stacked DRG, SDR)
  src/stacked/vanilla/       ← SDR 레이블링 + Merkle 트리 생성
storage-proofs-post/         ← PoSt (WindowPoSt, WinningPoSt)
filecoin-proofs/             ← 공개 API 래퍼
  src/api/seal.rs            ← seal_pre_commit_phase1/2, seal_commit_phase1/2
  src/api/post.rs            ← generate_window_post, generate_winning_post
filecoin-hashers/            ← Poseidon, SHA256, Blake2s 해시`;

export const REPO_ANNOTATIONS = [
  { lines: [1, 4] as [number, number], color: 'sky' as const, note: '코어 & PoRep 크레이트' },
  { lines: [5, 8] as [number, number], color: 'emerald' as const, note: 'PoSt & API 크레이트' },
];

export const SEAL_PIPELINE_CODE = `// filecoin-proofs/src/api/seal.rs

// PC1: Pre-Commit Phase 1 — SDR 레이블링 (느림, CPU/메모리 집약)
SealPreCommitPhase1Output = seal_pre_commit_phase1(
    porep_config,    // 섹터 크기, PoRep ID, 파티션 수
    cache_path,      // 캐시 디렉토리 (중간 Merkle 트리 저장)
    in_path,         // 원본 데이터 (봉인 전)
    out_path,        // 복제본 (봉인 후 덮어씀)
    prover_id,       // 저장 공급자 ID
    sector_id,
    ticket,          // 체인 랜덤성 (WinningPoSt 슬롯)
    piece_infos,     // 피스 커밋먼트 목록
)?;
// → 출력: Labels (11 계층), comm_d (원본 데이터 Merkle 루트)

// PC2: Pre-Commit Phase 2 — TreeC/TreeR 생성 (GPU 가속)
SealPreCommitOutput = seal_pre_commit_phase2(pc1_output, ...)?;
// → comm_r (복제본 Merkle 루트), comm_c (컬럼 해시 루트)

// C1: Commit Phase 1 — 증명 회로 입력 준비 (샘플 챌린지)
SealCommitPhase1Output = seal_commit_phase1(pc2_output, seed, ...)?;

// C2: Commit Phase 2 — Groth16 SNARK 생성 (GPU 필수)
SealCommitOutput = seal_commit_phase2(c1_output, prover_id, sector_id)?;
// → groth16_proof (192 bytes compressed)`;

export const SEAL_PIPELINE_ANNOTATIONS = [
  { lines: [3, 14] as [number, number], color: 'sky' as const, note: 'PC1: SDR 레이블링 (CPU)' },
  { lines: [16, 18] as [number, number], color: 'emerald' as const, note: 'PC2: Merkle Tree (GPU)' },
  { lines: [23, 25] as [number, number], color: 'amber' as const, note: 'C2: Groth16 SNARK (GPU)' },
];

export const PARAMS_CODE = `// SDR (Stacked DRG) 파라미터 (32GiB 섹터)
const BASE_DEGREE: usize = 6;     // 기본 부모 수 (DRG)
const EXP_DEGREE: usize = 8;      // 확장 부모 수 (Expander)
const TOTAL_PARENTS: usize = 14;  // 총 부모 수 (6 + 8)
LAYERS = 11;                       // DRG 레이어 수
NODE_SIZE = 32;                    // 노드 크기 (bytes)
NODES = 32GiB / 32 = 1_073_741_824; // 섹터당 노드 수

// 봉인 해시 함수
- 레이블링: SHA256 (CPU 최적화)
- Merkle 내부 노드: Poseidon (BLS12-381 위에서 ZK-friendly)
- 피스 해시: SHA256 (범용)

// Groth16 회로 크기 (C2)
- 회로 게이트: ~수억 개 (32GiB 섹터)
- 증명 크기: 192 bytes (Groth16 compressed)
- 검증 시간: ~10ms on-chain (pairing 2회)`;

export const PARAMS_ANNOTATIONS = [
  { lines: [1, 7] as [number, number], color: 'sky' as const, note: 'SDR 그래프 파라미터' },
  { lines: [9, 12] as [number, number], color: 'emerald' as const, note: '해시 함수 선택' },
  { lines: [14, 17] as [number, number], color: 'amber' as const, note: 'Groth16 회로 스펙' },
];
