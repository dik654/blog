export const C = {
  key: '#6366f1',
  val: '#10b981',
  sub: '#f59e0b',
  cursor: '#ef4444',
  dim: '#94a3b8',
};

export const STEPS = [
  {
    label: '기본 B+tree: 1 key → 1 value',
    body: '일반적인 key-value 저장소는 키 하나에 값 하나만 대응합니다.\n같은 키에 여러 값을 저장하려면 값을 직렬화하여 합쳐야 하는 불편함이 있습니다.',
  },
  {
    label: 'DupSort: 1 key → N values (중복 키 허용)',
    body: 'MDBX의 DupSort 모드는 하나의 key에 여러 value를 정렬된 상태로 저장합니다.\n내부적으로 leaf 노드 안에 sub-B+tree를 생성하여 value들을 관리합니다.',
  },
  {
    label: 'Sub-B+tree: leaf 노드 안의 트리',
    body: 'value가 많아지면 leaf 내부에 별도의 B+tree가 만들어집니다.\nsub-tree의 leaf에 개별 value들이 정렬 저장되어 O(log m) 검색이 가능합니다 (m = value 개수).',
  },
  {
    label: '블록체인 유스케이스: Address → Storage Slots',
    body: '하나의 주소(Address)에 여러 StorageSlot이 매핑됩니다.\nDupSort를 사용하면 주소별 storage를 효율적으로 순회하고 범위 조회할 수 있습니다.',
  },
  {
    label: '커서 연산: seek_dup, next_dup, prev_dup',
    body: 'DupSort 전용 커서 연산으로 특정 key의 value들만 순회합니다.\nseek_dup(key, val)으로 정확한 위치를 찾고, next_dup()로 다음 value를 가져옵니다.',
  },
];
