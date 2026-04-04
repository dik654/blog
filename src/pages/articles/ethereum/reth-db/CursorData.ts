export const CURSOR_OPS = [
  {
    title: 'seek_exact(key) — O(log n) 탐색',
    desc: 'B+tree의 root에서 leaf까지 키를 비교하며 내려간다. 깊이가 4~5 수준이므로 수억 개 레코드에서도 4~5회 페이지 접근으로 도달한다.',
    codeKey: 'db-cursor',
    useCase: 'RPC: 특정 블록 헤더 조회, 특정 계정 잔액 조회',
  },
  {
    title: 'walk_range(start..end) — 순차 순회',
    desc: 'seek로 시작 위치에 도달한 뒤, 리프 노드의 정렬된 링크드 리스트를 오른쪽으로 순회한다. 디스크 I/O가 순차적이므로 OS 프리페치(미리 읽기)가 동작한다.',
    codeKey: 'db-cursor',
    useCase: 'Stage: 블록 범위의 헤더/TX를 순차 처리',
  },
  {
    title: 'upsert(key, value) — 삽입/갱신',
    desc: '키가 존재하면 값을 교체하고, 없으면 새 리프를 삽입한다. B+tree가 자동으로 노드 split(분할)과 merge(병합)를 처리한다.',
    codeKey: 'db-cursor',
    useCase: 'Stage: 블록 실행 후 상태 갱신',
  },
  {
    title: 'DupSort 커서 — 하나의 키에 여러 값',
    desc: 'PlainStorageState 같은 DupSort 테이블에서 사용한다. 같은 Address 아래 수천 개의 스토리지 슬롯이 서브키로 정렬되어 있어 범위 조회에 최적이다.',
    codeKey: 'db-cursor',
    useCase: '컨트랙트의 특정 슬롯 범위 조회 (debug_storageRangeAt)',
  },
];

export const BTREE_VS_LSM = [
  { attr: '읽기 경로', btree: 'root→leaf 단일 경로', lsm: 'memtable + L0~L6 모두 탐색' },
  { attr: 'Worst-case 읽기', btree: 'O(log n) 보장', lsm: 'compaction 중 지연 급증' },
  { attr: '쓰기 성능', btree: '페이지 분할 비용', lsm: '순차 쓰기로 빠름' },
  { attr: '공간 효율', btree: '즉시 업데이트', lsm: '묘비(tombstone) 누적' },
  { attr: '블록체인 적합성', btree: '읽기 중심 워크로드에 유리', lsm: '쓰기 중심 워크로드에 유리' },
];
