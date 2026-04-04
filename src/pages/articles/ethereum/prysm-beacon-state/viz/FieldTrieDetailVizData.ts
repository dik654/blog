export const C = { trie: '#10b981', dirty: '#f59e0b', hash: '#8b5cf6', db: '#0ea5e9' };

export const STEPS = [
  {
    label: 'Setter → dirtyFields 마킹',
    body: 'SetBalances() 등 호출 시 dirtyFields[fieldIndex] = true 자동 마킹',
  },
  {
    label: 'recomputeFieldTrie()',
    body: '변경된 인덱스만 Merkle 서브트리에 반영 — O(log n)',
  },
  {
    label: '리프 수집 → 최종 루트',
    body: '모든 필드 루트를 BitwiseMerkleize()로 합쳐 최종 상태 루트 계산',
  },
];
