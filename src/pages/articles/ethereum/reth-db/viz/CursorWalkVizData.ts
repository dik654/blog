export const C = { key: '#6366f1', leaf: '#10b981', rw: '#f59e0b', dim: '#6b7280' };

export const STEPS = [
  {
    label: 'seek_exact(key=42) — B+tree 하강',
    body: 'Root에서 시작, 각 노드에서 key 비교로 자식 선택 → Leaf에서 key=42를 찾는다.',
  },
  {
    label: 'seek_exact 복잡도: O(h x log m)',
    body: '높이 h=3, 노드당 이진 탐색 O(log m). 1M 키에서도 ~21회 비교로 도달한다.',
  },
  {
    label: 'walk_range(10..50) — 리프 체인 순회',
    body: 'seek(10)으로 시작 leaf 도달 → next 포인터를 따라 key < 50까지 순차 이동한다.',
  },
  {
    label: '실제 워크로드: Stage vs RPC',
    body: 'Stage = walk_range (블록 범위 순차 읽기). RPC = seek_exact (특정 해시/키 조회).',
  },
];
