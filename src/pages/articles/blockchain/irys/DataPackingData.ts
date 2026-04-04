export const CHUNK_CODE = `// 두 가지 청크 형태
pub enum ChunkFormat {
    Unpacked(UnpackedChunk), // 원본 데이터 그대로
    Packed(PackedChunk),     // 매트릭스 패킹 적용
}

// 원본 청크
pub struct UnpackedChunk {
    pub data_root: DataRoot,    // Merkle 루트 해시
    pub data_size: u64,         // 전체 데이터 크기
    pub data_path: Base64,      // Merkle 증명 경로
    pub bytes: Base64,          // 실제 데이터 (CHUNK_SIZE = 256KB)
    pub tx_offset: TxChunkOffset, // 트랜잭션 내 청크 인덱스
}

// 패킹된 청크 (추가 메타데이터)
pub struct PackedChunk {
    // UnpackedChunk 필드 + ...
    pub packing_address: Address,   // 패킹한 노드의 주소
    pub partition_offset: PartitionChunkOffset,
    pub partition_hash: PartitionHash, // 파티션 식별자
}`;

export const MERKLE_CODE = `// 데이터 업로드 시
let chunks = split_into_chunks(&data, CHUNK_SIZE); // 256KB
let leaves: Vec<Hash> = chunks.iter().map(sha256).collect();
let merkle_root = build_merkle_tree(&leaves);

// 트랜잭션에 포함
struct IrysTransaction {
    data_root: MerkleRoot, // 전체 데이터의 Merkle 루트
    data_size: u64,
    // ...
}

// 저장 증명: 청크 + Merkle 경로로 포함 증명
fn verify_chunk(
    chunk: &UnpackedChunk,
    tx_data_root: &DataRoot,
) -> bool {
    // 1. 청크 해시 계산
    let chunk_hash = sha256(&chunk.bytes);

    // 2. Merkle 경로로 루트 재구성
    let computed_root = merkle_verify(&chunk.data_path, chunk_hash);

    // 3. 트랜잭션의 data_root와 일치 확인
    computed_root == *tx_data_root
}`;

export const PACKING_CODE = `// 상수
const PACKING_HASH_SIZE: usize = 32;            // SHA256 출력 크기
const HASH_ITERATIONS_PER_BLOCK: usize = 8192;  // 블록당 반복 횟수
// DATA_CHUNK_SIZE = 8192 × 32 = 262,144 bytes ≈ 256KB

// Step 1: 시드 해시 — address + partition_hash + chain_id + offset
fn compute_seed_hash(
    address: &Address,          // 20바이트
    offset: u64,                // 8바이트
    partition_hash: &[u8; 32],  // 32바이트
    irys_chain_id: u64,         // 8바이트
) -> [u8; 32] { /* SHA256(address || partition_hash || chain_id || offset) */ }

// Step 2: 2-Phase 엔트로피 생성
fn compute_entropy_chunk(seed_hash: &[u8; 32], chunk_size: usize) -> Vec<u8> {
    let mut entropy = vec![0u8; chunk_size];
    // Phase 1: 순차 해싱 — SHA256 체인으로 초기 엔트로피 행렬 구성
    for _i in 0..(chunk_size / PACKING_HASH_SIZE) { /* sha256 체인 */ }
    // Phase 2: 2D 해시 패킹 — 각 세그먼트가 이전 세그먼트에 의존 (wraparound)
    // M[i] = H(M[i-1] || M[i]),  M[0] = H(M[n-1] || M[0])
    let mut hash_count = 0;
    while hash_count < HASH_ITERATIONS_PER_BLOCK { /* ... */ }
    entropy
}

// Step 3: XOR 적용 / 언패킹 (XOR 자기역원)
fn packing_xor_vec_u8(entropy: &[u8], data: &[u8]) -> Vec<u8> {
    data.iter().zip(entropy).map(|(d, e)| d ^ e).collect()
}
fn unpack(packed: &[u8], entropy: &[u8]) -> Vec<u8> { packing_xor_vec_u8(entropy, packed) }`;

export const PARTITION_CODE = `// 파티션: 저장 공간을 관리하는 단위
struct Partition {
    hash: PartitionHash, // 파티션 식별자
    chunk_count: u64,    // 파티션에 포함된 청크 수
}

// 노드는 여러 파티션을 담당
// 각 파티션의 청크를 자신의 주소로 패킹
// 랜덤 샘플링으로 저장 증명 요청 수신
// → 해당 청크를 즉시 언패킹해 응답해야 함`;
