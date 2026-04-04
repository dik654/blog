export const proofGenCode = `World ID 증명 생성 과정 (Semaphore 프로토콜):

// 1. 사용자의 비밀 키로부터 신원 생성
let identity = semaphore_rs::identity::Identity::from_secret(&mut secret_bytes);
let commitment = identity.commitment();

// 2. Poseidon Merkle Tree에 커밋먼트 등록
let mut tree = LazyPoseidonTree::new_with_dense_prefix(
  30,                  // TREE_DEPTH
  &U256::ZERO,         // 기본값
);
tree = tree.update_with_mutation(user_index, &identity.commitment());

// 3. Semaphore 영지식 증명 생성
let external_nullifier_hash = EncodedExternalNullifier::from(external_nullifier);
let signal = transaction_hash;        // 트랜잭션 해시가 signal
let merkle_proof = tree.proof(user_index);

let proof = semaphore_rs::protocol::generate_proof(
  &identity,               // 비밀 신원
  &merkle_proof,           // Merkle 포함 증명
  external_nullifier_hash, // 월별 사용량 제한용
  signal,                  // 트랜잭션 해시
)?;

// 4. Nullifier Hash 생성 (중복 방지)
let nullifier_hash = semaphore_rs::protocol::generate_nullifier_hash(
  &identity, external_nullifier_hash,
);`;

export const proofGenAnnotations = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: '신원 생성 & 커밋먼트' },
  { lines: [7, 12] as [number, number], color: 'emerald' as const, note: 'Poseidon Merkle Tree 등록' },
  { lines: [14, 24] as [number, number], color: 'amber' as const, note: 'Semaphore ZK 증명 생성' },
  { lines: [27, 29] as [number, number], color: 'rose' as const, note: 'Nullifier: 중복 사용 방지' },
];

export const pbhPayloadCode = `PBH 페이로드 구조:

#[derive(Default, Clone, Debug, RlpEncodable, RlpDecodable)]
pub struct PBHPayload {
  pub external_nullifier: ExternalNullifier,  // 월별 사용량 제한
  pub nullifier_hash: Field,                  // 중복 방지 해시
  pub root: Field,                            // Merkle 루트
  pub proof: Proof,                           // ZK 증명
}

External Nullifier 인코딩 (256비트):
  ┌──────────────────────────────────────────────────┐
  │ Bits 255-48: Empty (208 bits) - 예약 공간        │
  │ Bits 47-32:  Year (16 bits)   | 예: 2024        │
  │ Bits 31-24:  Month (8 bits)   | 예: 12월        │
  │ Bits 23-8:   Nonce (16 bits)  | 월별 사용 횟수   │
  │ Bits 7-0:    Version (8 bits) | v1 = 0x01       │
  └──────────────────────────────────────────────────┘`;

export const pbhPayloadAnnotations = [
  { lines: [3, 9] as [number, number], color: 'sky' as const, note: 'PBHPayload 구조체 (RLP 직렬화)' },
  { lines: [11, 18] as [number, number], color: 'emerald' as const, note: 'External Nullifier 비트 레이아웃' },
];
