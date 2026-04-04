export const TRIE_CHALLENGES = [
  {
    title: '전체 재계산은 O(n)',
    desc: '이더리움 메인넷에는 약 2.5억 개 계정이 존재한다. 매 블록마다 전체 trie를 재해시하면 수십 초가 걸린다. 블록 시간 12초 내에 완료할 수 없다.',
    color: '#ef4444',
  },
  {
    title: 'Geth의 dirty trie 커밋',
    desc: 'Geth는 변경된 노드를 "dirty"로 표시하고 전체 trie를 순회하며 커밋한다. 변경이 1개여도 전체 트리를 탐색해야 dirty 노드를 찾는다.',
    color: '#f59e0b',
  },
  {
    title: 'Reth의 PrefixSet 최적화',
    desc: 'BTreeSet으로 변경된 키만 추적한다. trie 순회 시 PrefixSet.contains()로 서브트리 재계산 여부를 O(log n)에 판단한다. 변경 없는 서브트리는 완전히 건너뛴다.',
    color: '#10b981',
  },
];

export const PERF_COMPARISON = [
  { scenario: '1개 계정 변경', geth: '전체 trie 순회', reth: '3개 노드만 재해시', speedup: '~1000x' },
  { scenario: '100개 계정 변경', geth: '전체 trie 순회', reth: '~300개 노드 재해시', speedup: '~100x' },
  { scenario: '대규모 배치', geth: '전체 trie 순회', reth: '변경 키 수에 비례', speedup: '~10-50x' },
];
