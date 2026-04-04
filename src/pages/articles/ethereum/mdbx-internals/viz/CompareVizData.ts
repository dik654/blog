export const C = {
  mdbx: '#10b981',
  lmdb: '#6366f1',
  rocks: '#f59e0b',
  level: '#ef4444',
  sqlite: '#0ea5e9',
  dim: '#94a3b8',
};

export const STEPS = [
  {
    label: 'LMDB vs MDBX: 어떤 점이 개선되었나?',
    body: 'MDBX는 LMDB를 포크하여 실무에서 발견된 문제들을 수정했습니다.\n자동 DB 크기 조절(geometry), LIFO 페이지 회수, reader table 안전성이 핵심 개선점입니다.',
  },
  {
    label: 'RocksDB: LSM-tree 기반, 쓰기 최적화',
    body: 'Facebook이 LevelDB를 포크하여 개선한 엔진입니다.\n쓰기 처리량은 높지만, compaction이 읽기 지연을 불예측하게 만듭니다.',
  },
  {
    label: 'LevelDB: Geth가 사용하는 엔진',
    body: 'Google이 개발한 LSM-tree 엔진으로, Geth의 기본 저장소입니다.\ncompaction stall로 인한 주기적 지연이 블록 동기화 성능에 영향을 줍니다.',
  },
  {
    label: 'SQLite: 범용 RDBMS',
    body: '가장 널리 쓰이는 임베디드 DB이지만, SQL 파싱 오버헤드와 B-tree(B+tree 아님) 구조가 블록체인의 단순 KV 패턴에는 과도한 추상화입니다.',
  },
  {
    label: '4개 엔진 특성 비교',
    body: 'MDBX는 읽기 지연이 가장 예측 가능하고, mmap으로 zero-copy 읽기를 지원합니다.\n블록체인처럼 읽기 비중이 높은 워크로드에 적합합니다.',
  },
];
