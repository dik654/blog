import type { CodeRef } from '@/components/code/types';
import { merkleProofCodeRefs } from './codeRefsMerkleProof';

export const merkleCodeRefs: Record<string, CodeRef> = {
  'merkle-tree': {
    path: 'merkle.rs — SparseMerkleTree struct',
    lang: 'rust',
    highlight: [1, 22],
    desc: 'Poseidon 기반 Sparse Merkle Tree.\n2^depth개 리프 중 실제 삽입된 것만 HashMap에 저장.',
    code: `/// Poseidon 기반 Sparse Merkle Tree
pub struct SparseMerkleTree {
    pub depth: usize,
    pub root: Fr,
    /// default_hashes[i] = 높이 i에서의 빈 서브트리 해시
    ///   default[0] = ZERO (빈 리프)
    ///   default[i+1] = H(default[i], default[i])
    default_hashes: Vec<Fr>,
    /// (level, index) → 해시값
    /// level 0 = 리프, level depth = 루트
    nodes: HashMap<(usize, [u64; 4]), Fr>,
    /// key_repr → value (원본 값 저장)
    leaves: HashMap<[u64; 4], Fr>,
    params: PoseidonParams,
}`,
    annotations: [
      { lines: [5, 8], color: 'sky', note: 'default_hashes — 빈 서브트리의 해시를 미리 계산. insert 없는 노드는 이 값을 사용' },
      { lines: [9, 11], color: 'emerald', note: 'nodes — 실제 존재하는 노드만 저장. 2^256개 리프를 모두 저장할 필요 없음' },
      { lines: [14, 14], color: 'amber', note: 'PoseidonParams 캐시 — 매 해시마다 상수 재생성 방지' },
    ],
  },
  'merkle-insert': {
    path: 'merkle.rs — insert (키-값 쌍 삽입)',
    lang: 'rust',
    highlight: [1, 28],
    desc: '리프 삽입 후 루트까지 경로 재계산.\nbit=0 → 왼쪽, bit=1 → 오른쪽.',
    code: `/// 키-값 쌍 삽입
pub fn insert(&mut self, key: Fr, value: Fr) {
    let key_repr = key.to_repr();
    self.leaves.insert(key_repr, value);

    // 리프 해시 = H(key, value)
    let leaf_hash = poseidon_hash_with_params(&self.params, key, value);
    self.nodes.insert((0, key_repr), leaf_hash);

    let mut current = leaf_hash;
    for level in 0..self.depth {
        let node_idx = shr_bits(&key_repr, level);
        let sibling_idx = flip_bit0(&node_idx);

        let sibling = self.nodes
            .get(&(level, sibling_idx))
            .copied()
            .unwrap_or(self.default_hashes[level]);

        current = if !get_bit(&key_repr, level) {
            poseidon_hash_with_params(&self.params, current, sibling)
        } else {
            poseidon_hash_with_params(&self.params, sibling, current)
        };

        let parent_idx = shr_bits(&key_repr, level + 1);
        self.nodes.insert((level + 1, parent_idx), current);
    }
    self.root = current;
}`,
    annotations: [
      { lines: [6, 7], color: 'sky', note: 'H(key, value) — key를 포함해야 다른 key의 같은 value와 구분' },
      { lines: [12, 13], color: 'emerald', note: 'shr_bits, flip_bit0 — 비트 연산으로 형제 노드 인덱스 계산' },
      { lines: [20, 23], color: 'amber', note: 'key 비트가 경로를 결정 — 0이면 왼쪽 자식, 1이면 오른쪽 자식' },
    ],
  },
  ...merkleProofCodeRefs,
};
