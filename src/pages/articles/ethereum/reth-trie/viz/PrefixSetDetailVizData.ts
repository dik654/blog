export const C = { key: '#6366f1', match: '#10b981', skip: '#6b7280', change: '#f59e0b', root: '#8b5cf6' };

export const STEPS = [
  {
    label: 'PrefixSet.insert(key) — 변경 키 수집',
    body: '블록 실행 중 변경된 key를 BTreeSet에 삽입하고 freeze()로 불변 집합화합니다.',
  },
  {
    label: 'contains(prefix) — 서브트리 재계산 여부',
    body: 'BTreeSet.range(prefix..)로 해당 prefix 존재 여부를 판단하여 재해시 결정합니다.',
  },
  {
    label: 'Trie 순회 — Branch에서 PrefixSet 확인',
    body: 'Root부터 순회하며 각 Branch에서 PrefixSet.contains()로 변경 없는 서브트리를 건너뜁니다.',
  },
  {
    label: '변경된 Leaf에서 새 해시 계산',
    body: '변경된 서브트리만 재귀 탐색하여 Leaf부터 Root까지 keccak256 해시를 갱신합니다.',
  },
  {
    label: 'Storage trie도 동일 방식 처리',
    body: '각 계정의 storage prefix를 별도 PrefixSet으로 관리하여 최종 account trie root를 반환합니다.',
  },
];
