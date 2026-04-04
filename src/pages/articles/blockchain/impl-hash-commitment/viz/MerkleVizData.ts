export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'Sparse Merkle Tree: 빈 서브트리는 default_hash',
    body: '삽입된 리프만 실제 저장, 나머지는 default_hash로 대체 — 공간 효율적',
  },
  {
    label: 'insert: 리프 → 루트까지 경로 재계산',
    body: 'H(key, value) 리프에서 루트까지 depth회 해시 — key 비트가 경로 결정',
  },
  {
    label: 'prove: 형제 노드 해시 수집',
    body: '각 레벨의 형제 해시 수집 — siblings + key + value만으로 루트 재구성 가능',
  },
  {
    label: 'verify_merkle_proof: 독립 검증',
    body: 'H(key,value)에서 siblings로 루트까지 재계산 — root 일치 시 멤버십 증명 성공',
  },
];

export const STEP_REFS = ['merkle-tree', 'merkle-insert', 'merkle-proof', 'merkle-proof'];
export const STEP_LABELS = ['merkle.rs — SparseMerkleTree::new', 'merkle.rs — insert', 'merkle.rs — prove', 'merkle.rs — verify_merkle_proof'];
