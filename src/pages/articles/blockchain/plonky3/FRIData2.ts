export const merkleTreeCode = `// merkle-tree/src/merkle_tree.rs

/// 머클 트리
/// - F: 잎 원소 타입 (BabyBear 등)
/// - W: 다이제스트 워드 타입
/// - DIGEST_ELEMS: 다이제스트 크기 (예: Poseidon2 → 8개 BabyBear)
pub struct MerkleTree<F, W, M, const DIGEST_ELEMS: usize> {
    pub(crate) leaves: Vec<M>,                        // 원본 행렬 (참조용)
    pub(crate) digest_layers: Vec<Vec<[W; DIGEST_ELEMS]>>,  // 내부 노드
    _phantom: PhantomData<F>,
}

// MerkleTreeMmcs: Mmcs<T> 구현
pub struct MerkleTreeMmcs<P, PW, H, C, const DIGEST_ELEMS: usize> {
    hash: H,       // 리프 해시 함수
    compress: C,   // 내부 노드 압축 함수 (2개 다이제스트 → 1개)
    _phantom: PhantomData<(P, PW)>,
}

// 다이제스트 레이어 구성:
// - 최고 높이 행렬들: 첫 번째 레이어에 패킹하여 처리
// - 짧은 행렬들: 높이에 맞는 레이어에 주입 (injection)
// → 다양한 크기의 다항식을 하나의 트리에 효율적으로 커밋

// Poseidon2 압축 함수 사용:
// 내부 노드 = Compress([왼쪽_자식 || 오른쪽_자식])
// 잎 해시 = Hash(행_데이터)`;
