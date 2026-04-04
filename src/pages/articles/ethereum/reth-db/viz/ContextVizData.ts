export const C = { db: '#6366f1', rw: '#10b981', err: '#ef4444', ok: '#10b981', hot: '#f59e0b', cold: '#8b5cf6' };

export const STEPS = [
  {
    label: 'EL 노드가 저장해야 할 데이터',
    body: '블록 헤더, TX, 영수증, 계정 상태 등 수백 GB를 빠르게 읽고 써야 합니다.',
  },
  {
    label: '문제: LevelDB의 읽기 성능',
    body: 'Geth의 LSM-tree는 compaction이 읽기를 간섭하여 worst-case 지연 예측이 불가합니다.',
  },
  {
    label: '문제: 데이터가 커지면 전부 느려짐',
    body: '고대/최신 블록이 같은 DB에 섞이면 B+tree 깊이 증가로 전체가 느려집니다.',
  },
  {
    label: '해결: MDBX B+tree (읽기 최적화)',
    body: 'MDBX는 B+tree 기반 읽기 O(log n) 보장 + MVCC로 읽기/쓰기 비차단입니다.',
  },
  {
    label: '해결: StaticFiles로 고대 데이터 분리',
    body: 'finalized 이전 데이터를 flat file로 이동하여 MDBX에 최신 데이터만 유지합니다.',
  },
];
