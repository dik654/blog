import type { CodeRef } from '@/components/code/types';

export const merkleProofCodeRefs: Record<string, CodeRef> = {
  'merkle-proof': {
    path: 'merkle.rs — prove + verify_merkle_proof',
    lang: 'rust',
    highlight: [1, 30],
    desc: 'Merkle 증명: 형제 노드 수집 + 루트까지 해시 체인 검증.\n트리 없이도 root, key, value, siblings만으로 검증 가능.',
    code: `/// 머클 증명 생성 — 형제 노드 해시 수집
pub fn prove(&self, key: &Fr) -> MerkleProof {
    let key_repr = key.to_repr();
    let mut siblings = Vec::with_capacity(self.depth);
    for level in 0..self.depth {
        let node_idx = shr_bits(&key_repr, level);
        let sibling_idx = flip_bit0(&node_idx);
        let sibling = self.nodes
            .get(&(level, sibling_idx))
            .copied()
            .unwrap_or(self.default_hashes[level]);
        siblings.push(sibling);
    }
    MerkleProof { siblings }
}

/// 머클 증명 검증 — 트리 없이 독립 검증
pub fn verify_merkle_proof(
    root: Fr, key: Fr, value: Fr, proof: &MerkleProof,
) -> bool {
    let params = PoseidonParams::new();
    let key_repr = key.to_repr();
    let mut current = poseidon_hash_with_params(&params, key, value);
    for (level, sibling) in proof.siblings.iter().enumerate() {
        current = if !get_bit(&key_repr, level) {
            poseidon_hash_with_params(&params, current, *sibling)
        } else {
            poseidon_hash_with_params(&params, *sibling, current)
        };
    }
    current == root
}`,
    annotations: [
      { lines: [5, 12], color: 'sky', note: '각 레벨에서 형제 노드를 수집 — 없으면 default_hash 사용' },
      { lines: [17, 19], color: 'emerald', note: '독립 검증 — 전체 트리 없이 root + key + value + siblings만 필요' },
      { lines: [23, 29], color: 'amber', note: 'insert와 동일한 해시 체인 — current == root이면 멤버십 증명 성공' },
    ],
  },
};
