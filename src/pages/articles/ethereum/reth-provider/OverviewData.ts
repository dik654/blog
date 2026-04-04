export const PROVIDER_LAYERS = [
  {
    title: 'BundleState (메모리 캐시)',
    desc: '블록 실행 결과가 DB에 기록되기 전까지 메모리에 존재한다. 가장 먼저 조회되므로 디스크 I/O 없이 응답 가능.',
    color: '#10b981',
  },
  {
    title: 'MDBX (B+tree 디스크 DB)',
    desc: 'PlainAccountState, PlainStorageState 테이블에 최신 확정 상태를 저장한다. B+tree는 읽기 최적화 구조로 LevelDB(LSM-tree)보다 범위 쿼리에 유리.',
    color: '#f59e0b',
  },
  {
    title: 'StaticFiles (고대 블록 아카이브)',
    desc: 'finalized 이전 블록의 헤더, 영수증, 트랜잭션을 flat file로 보관한다. 블록 번호 = 파일 오프셋이므로 O(1) 접근.',
    color: '#6b7280',
  },
];

export const GETH_PROBLEMS = [
  {
    title: 'DB 구현에 직접 결합',
    desc: 'statedb가 LevelDB 구체 구현에 의존한다. 저장소를 교체하려면 실행 엔진 코드까지 수정해야 한다.',
  },
  {
    title: '테스트 시 실제 DB 필요',
    desc: 'Mock 주입이 어려워 단위 테스트에서도 LevelDB 인스턴스를 띄워야 한다. 테스트 속도가 느리고 격리가 어렵다.',
  },
  {
    title: '시점별 접근 패턴 혼재',
    desc: '최신 상태, 과거 상태, 고대 데이터의 접근 경로가 코드 곳곳에 분산되어 있다. 새 저장소 계층 추가 시 변경 범위가 넓다.',
  },
];
