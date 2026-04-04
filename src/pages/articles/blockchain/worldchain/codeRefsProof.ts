import type { CodeRef } from '@/components/code/types';

export const codeRefsProof: Record<string, CodeRef> = {
  'wc-semaphore-proof': {
    path: 'world-chain-builder/crates/world/pbh/src/semaphore.rs',
    code: `/// Semaphore ZK 증명
let identity = Identity::from_secret(&mut secret);
let commitment = identity.commitment();
let mut tree = LazyPoseidonTree::new_with_dense_prefix(
    30, &U256::ZERO,
);
tree = tree.update_with_mutation(
    user_index, &identity.commitment(),
);
let proof = semaphore_rs::protocol::generate_proof(
    &identity,
    &tree.proof(user_index),
    external_nullifier_hash,
    transaction_hash,
)?;
let nullifier = generate_nullifier_hash(
    &identity, external_nullifier_hash,
);`,
    lang: 'rust',
    highlight: [1, 18],
    desc: 'Semaphore ZK: Identity → Merkle → 증명 → Nullifier.',
    annotations: [
      { lines: [2, 3], color: 'sky', note: '신원 + 커밋먼트' },
      { lines: [4, 9], color: 'emerald', note: 'Poseidon Merkle Tree' },
      { lines: [10, 15], color: 'amber', note: 'ZK 증명 생성' },
      { lines: [16, 18], color: 'rose', note: 'Nullifier 중복 방지' },
    ],
  },
  'wc-pbh-payload': {
    path: 'world-chain-builder/crates/world/pbh/src/payload.rs',
    code: `/// PBH 페이로드
#[derive(Default, Clone, RlpEncodable)]
pub struct PBHPayload {
    pub external_nullifier: ExternalNullifier,
    pub nullifier_hash: Field,
    pub root: Field,
    pub proof: Proof,
}
// External Nullifier (256비트):
// Bits 47-32: Year | 31-24: Month
// Bits 23-8: Nonce | 7-0: Version`,
    lang: 'rust',
    highlight: [1, 11],
    desc: 'PBHPayload: nullifier로 월별 제한 + ZK 증명.',
    annotations: [
      { lines: [3, 7], color: 'sky', note: 'PBHPayload 구조체' },
      { lines: [9, 11], color: 'emerald', note: 'External Nullifier 비트' },
    ],
  },
};
