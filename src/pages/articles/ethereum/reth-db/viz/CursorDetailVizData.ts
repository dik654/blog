export const C = {
  key: '#6366f1', leaf: '#10b981', rw: '#f59e0b',
  db: '#8b5cf6', mvcc: '#0ea5e9',
};

export const STEPS = [
  {
    label: 'seek_exact(key) — B+tree 탐색',
    body: 'Root → Branch → Leaf 순으로 O(log n)에 목표 리프에 도달합니다.',
  },
  {
    label: 'walk_range(start..end) — 연속 읽기',
    body: '정렬된 리프 노드를 순차 순회하여 순차 디스크 I/O로 캐시 히트율이 높습니다.',
  },
  {
    label: 'upsert(key, value) — 삽입/갱신',
    body: '키 존재 시 값 갱신, 없으면 삽입하며 B+tree가 자동 split/merge합니다.',
  },
  {
    label: 'DupSort — 하나의 키에 여러 값',
    body: '같은 Address 아래 수천 개 스토리지 슬롯을 정렬 저장하여 범위 조회에 최적입니다.',
  },
  {
    label: 'MVCC — 읽기와 쓰기 동시 가능',
    body: '읽기 트랜잭션은 스냅샷을 참조하여 블록 실행(쓰기)과 RPC 조회(읽기)가 동시에 가능합니다.',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'db-cursor', 1: 'db-cursor', 2: 'db-cursor', 3: 'db-cursor',
};
