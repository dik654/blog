export const PREFIX_OPERATIONS = [
  {
    name: 'insert(nibbles)',
    phase: '블록 실행 중',
    desc: 'ExecutionStage가 트랜잭션을 실행하면서 변경된 account/storage key를 BTreeSet에 추가한다. nibbles는 16진수 반바이트(4bit) 단위의 키 표현이다.',
    color: '#6366f1',
  },
  {
    name: 'contains(prefix)',
    phase: 'trie 순회 중',
    desc: '서브트리 재계산 여부를 판단한다. BTreeSet.range(prefix..)로 prefix 이상인 첫 키를 찾고, 그 키가 실제로 prefix로 시작하는지 확인한다. O(log n).',
    color: '#10b981',
  },
  {
    name: 'freeze()',
    phase: '실행 완료 후',
    desc: '블록 실행이 끝나면 더 이상 키를 추가하지 않는다. BTreeSet은 삽입 시 자동 정렬되므로 별도 정렬 작업 없이 바로 range 쿼리가 가능하다.',
    color: '#f59e0b',
  },
];

export const BTREE_VS_HASH = {
  btree: { name: 'BTreeSet', lookup: 'O(log n)', range: 'O(log n + k)', ordered: true },
  hash: { name: 'HashSet', lookup: 'O(1)', range: '불가', ordered: false },
  reason: 'PrefixSet의 핵심 연산은 prefix 매칭이다. "이 prefix로 시작하는 키가 있는가?"를 판단하려면 range 쿼리가 필수다. HashSet은 정확히 일치하는 키만 찾을 수 있고, prefix 범위 탐색은 불가능하다.',
};
