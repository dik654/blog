export const OVERLAY_STEPS = [
  {
    title: '1. Account trie 루트부터 순회',
    desc: 'DB에 저장된 기존 trie의 루트 노드에서 시작한다. 각 Branch 노드에서 자식 방향으로 내려가며 탐색한다.',
    color: '#6366f1',
  },
  {
    title: '2. PrefixSet.contains()로 분기 판단',
    desc: '각 Branch에서 해당 prefix가 PrefixSet에 포함되는지 확인한다. 포함되지 않으면 기존 해시를 그대로 재사용하고 하위 노드를 탐색하지 않는다.',
    color: '#f59e0b',
  },
  {
    title: '3. 변경된 Leaf에서 새 해시 계산',
    desc: '변경된 서브트리만 재귀 탐색한다. Leaf 노드에서 새 keccak256 해시를 계산하고, 부모 Branch까지 해시를 갱신한다.',
    color: '#10b981',
  },
  {
    title: '4. Storage trie 처리 후 최종 루트 반환',
    desc: '각 계정의 storage trie도 동일 방식으로 처리한다. storage root가 account leaf에 반영되고, 최종 account trie root가 새 상태 루트가 된다.',
    color: '#8b5cf6',
  },
];

export const STATE_ROOT_FIELDS = [
  { name: 'tx', desc: 'DB 읽기 트랜잭션 — 기존 trie 노드에 접근하는 핸들. MVCC 격리로 다른 쓰기와 충돌하지 않는다.' },
  { name: 'changed_account_prefixes', desc: 'PrefixSet — 변경된 account 키의 prefix 집합. account trie 순회 시 재계산 범위를 한정한다.' },
  { name: 'changed_storage_prefixes', desc: 'HashMap<B256, PrefixSet> — 계정별 변경된 storage prefix. 각 계정의 storage trie 재계산 범위를 독립적으로 추적한다.' },
  { name: 'hashed_state', desc: 'HashedPostState — 해시된 주소/키 기반의 변경 상태. overlay로 적용할 새 값들이 여기에 있다.' },
];
