export const WINDOW_VS_WINNING_CODE = `// storage-proofs-post/src/fallback/vanilla.rs

// SetupParams: PoSt 공통 파라미터
pub struct SetupParams {
    pub sector_size: u64,        // 섹터 크기 (bytes)
    pub challenge_count: usize,  // 섹터당 챌린지 노드 수
    pub sector_count: usize,     // 한 번에 증명할 섹터 수
    pub api_version: ApiVersion, // V1_0_0 / V1_1_0 / V1_2_0
}

// WindowPoSt
// - 24시간(~2880 에포크)마다 모든 섹터를 증명
// - sector_count: 섹터 세트(~2349 섹터 per partition)
// - challenge_count: 10개 노드/섹터
// - Groth16 회로: partition당 독립 증명
// - 누락 시 Power 페널티 + 슬래싱

// WinningPoSt
// - 블록 생성 시 당첨 섹터(5개)에 대해 즉시 증명
// - challenge_count: 66개 노드/섹터
// - 빠른 SNARK (매우 작은 회로)
// - 성공 시 블록 보상 수령`;

export const WINDOW_VS_WINNING_ANNOTATIONS = [
  { lines: [3, 9] as [number, number], color: 'sky' as const, note: 'PoSt 공통 파라미터' },
  { lines: [11, 16] as [number, number], color: 'emerald' as const, note: 'WindowPoSt (24시간 주기)' },
  { lines: [18, 22] as [number, number], color: 'amber' as const, note: 'WinningPoSt (블록 생성 시)' },
];

export const CHALLENGE_CODE = `// storage-proofs-post/src/fallback/vanilla.rs

// 챌린지 인덱스: ApiVersion에 따른 결정론적 계산
pub fn get_challenge_index(
    api_version: ApiVersion,
    sector_index: usize,
    challenge_count_per_sector: usize,
    challenge_index: usize,
) -> u64 {
    (match api_version {
        // V1.0/V1.1: 섹터별 순차 인덱스
        ApiVersion::V1_0_0 | ApiVersion::V1_1_0 =>
            sector_index * challenge_count_per_sector + challenge_index,
        // V1.2: 글로벌 challenge 인덱스
        ApiVersion::V1_2_0 => challenge_index,
    } as u64)
}

// 각 챌린지 노드에 대한 Merkle 포함 증명 생성
// - 노드 인덱스 → 복제본 데이터 읽기
// - Poseidon Arity-8 Merkle 트리에서 경로 열기

pub struct Proof<P: MerkleProofTrait> {
    pub sectors: Vec<SectorProof<P>>,
}

pub struct SectorProof<Proof: MerkleProofTrait> {
    pub inclusion_proofs: Vec<MerkleProof<...>>, // 각 챌린지의 Merkle 증명
    pub comm_c: <Proof::Hasher as Hasher>::Domain,
    pub comm_r_last: <Proof::Hasher as Hasher>::Domain,
}`;

export const CHALLENGE_ANNOTATIONS = [
  { lines: [4, 17] as [number, number], color: 'sky' as const, note: '챌린지 인덱스 계산' },
  { lines: [23, 31] as [number, number], color: 'emerald' as const, note: '섹터 증명 구조체' },
];

export const MERKLE_TREE_CODE = `// storage-proofs-core/src/merkle/

// Filecoin 섹터용 Merkle 트리 유형
BinaryMerkleTree   // Arity=2, SHA256, comm_d (원본 데이터)
OctMerkleTree      // Arity=8, Poseidon, TreeR/TreeC (복제본)
  └─ SubTree: Arity=8 (아래 레이어)
  └─ TopTree: Arity=8 (위 레이어)
  → 2계층 구조로 32GiB 섹터 효율적 처리

// 해시 함수 선택 이유:
// - Poseidon: BLS12-381 스칼라체 위에서 Groth16 회로 내 연산 최적화
//   → 회로 게이트 수 최소화 (SHA256 대비 10배 이상 절약)
// - SHA256: 범용 (comm_d, replica_id 등 회로 외부 사용)

// Merkle 증명 크기 (32GiB, Arity=8)
// 리프 수: 2^30 = 10억
// 트리 높이: log8(2^30) = 10 레벨
// 증명 크기: 10 * 7 * 32 bytes = 2,240 bytes per challenge`;

export const MERKLE_TREE_ANNOTATIONS = [
  { lines: [3, 8] as [number, number], color: 'sky' as const, note: '트리 유형 (Binary vs Oct)' },
  { lines: [10, 13] as [number, number], color: 'emerald' as const, note: '해시 함수 선택 이유' },
  { lines: [15, 18] as [number, number], color: 'amber' as const, note: 'Merkle 증명 크기 분석' },
];
