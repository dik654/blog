export const MERKLE_TREE_CODE = `// merkle-tree/src/merkle_tree.rs
pub struct MerkleTree<F, W, M, const DIGEST_ELEMS: usize> {
    pub(crate) leaves: Vec<M>,             // 리프 행렬들
    pub(crate) digest_layers: Vec<Vec<[W; DIGEST_ELEMS]>>,
    _phantom: PhantomData<F>,
}

// 트리 구성 알고리즘:
// 1. 높이별 정렬: 행렬들을 높이 순으로 정렬
// 2. 첫 다이제스트: 가장 큰 행렬들의 행을 해시
// 3. 레이어별 압축: 2:1 압축과 작은 행렬 주입 반복
// → 루트 = 최종 다이제스트 (커밋먼트)`;

export const MERKLE_TREE_ANNOTATIONS = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: '다중 높이 행렬 지원' },
  { lines: [8, 12] as [number, number], color: 'emerald' as const, note: '트리 구성 3단계' },
];

export const MMCS_CODE = `// MerkleTreeMmcs — Mixed Matrix Commitment Scheme
pub struct MerkleTreeMmcs<P, PW, H, C, const DIGEST_ELEMS: usize> {
    hash: H,      // 리프 해시 함수 (Poseidon2)
    compress: C,   // 내부 노드 압축 함수
}

// 커밋: 행렬들 → Merkle 트리 → 루트 해시
fn commit(inputs: Vec<M>) -> (Self::Commitment, Self::ProverData) {
    let tree = MerkleTree::new(&self.hash, &self.compress, inputs);
    let root = tree.root();
    (root, tree)
}

// 배치 오픈: 특정 인덱스의 행 + Merkle 경로
// 서로 다른 높이 행렬은 비트 시프트로 인덱스 조정
// j = index >> (log2_ceil(max_height) - log2_ceil(matrix_height))`;

export const MMCS_ANNOTATIONS = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: '해시 + 압축 함수 주입' },
  { lines: [8, 12] as [number, number], color: 'emerald' as const, note: '커밋: 행렬 → 트리 → 루트' },
  { lines: [14, 16] as [number, number], color: 'amber' as const, note: '다중 높이 인덱스 매핑' },
];
