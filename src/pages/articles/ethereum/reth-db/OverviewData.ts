export const WHY_MDBX = [
  {
    title: 'LSM-tree의 읽기 성능 문제',
    desc: 'Geth의 LevelDB는 LSM-tree(Log-Structured Merge-tree) 기반이다. 쓰기는 빠르지만, 읽기 시 여러 레벨(memtable + L0~L6)을 탐색해야 한다. compaction(레벨 간 병합)이 진행 중이면 읽기 지연이 급증한다.',
  },
  {
    title: 'B+tree의 읽기 보장',
    desc: 'MDBX는 B+tree 기반이다. 모든 읽기가 root → branch → leaf 경로를 따라 O(log n)에 완료된다. 레벨 병합이 없으므로 worst-case 지연을 예측할 수 있다.',
  },
  {
    title: 'mmap 기반 zero-copy 읽기',
    desc: 'MDBX는 데이터 파일을 mmap(메모리 매핑, OS가 파일을 가상 메모리에 매핑하는 기법)으로 매핑한다. 읽기 시 별도 복사(memcpy) 없이 커널 페이지 캐시를 직접 참조한다.',
  },
  {
    title: 'MVCC로 읽기/쓰기 동시 실행',
    desc: 'MVCC(Multi-Version Concurrency Control)는 읽기 트랜잭션이 스냅샷을 참조하는 방식이다. 쓰기 트랜잭션이 진행 중이어도 읽기가 차단되지 않는다. 블록 실행(쓰기)과 RPC 조회(읽기)를 동시에 처리할 수 있다.',
  },
];
