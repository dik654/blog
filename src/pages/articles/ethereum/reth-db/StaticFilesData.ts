export const ARCHIVE_STEPS = [
  {
    title: 'finalized 경계 결정',
    desc: 'CL(합의 레이어)이 블록을 finalize하면 되돌릴 수 없다. 이 경계 이전의 데이터는 변경 불가능(immutable)하므로 MDBX에서 분리할 수 있다.',
  },
  {
    title: '세그먼트별 flat file 생성',
    desc: 'Headers, Transactions, Receipts를 각각 별도 파일로 아카이브한다. 블록 번호가 파일 내 오프셋이 되므로 O(1) 접근이 가능하다. 인덱스 구조가 필요 없다.',
  },
  {
    title: 'MDBX에서 고대 데이터 삭제',
    desc: '아카이브 완료 후 MDBX에서 해당 범위의 레코드를 삭제한다. B+tree에 저장된 레코드 수가 줄어들면 트리 깊이가 감소하고, 최신 데이터 조회가 빨라진다.',
  },
  {
    title: 'ProviderFactory가 경계 라우팅',
    desc: '조회 요청이 들어오면 highest_block 맵을 확인한다. 요청 블록이 경계 이하면 StaticFile에서, 이상이면 MDBX에서 읽는다. 호출자는 이 분기를 의식하지 않는다.',
  },
];

export const GETH_FREEZER_COMPARISON = [
  { attr: '이름', reth: 'StaticFileProvider', geth: 'Freezer (ancient store)' },
  { attr: '저장 포맷', reth: 'flat file (세그먼트별)', geth: 'flat file (.cidx + .cdat)' },
  { attr: '접근 방식', reth: '블록번호 = 오프셋 → O(1)', geth: '인덱스 파일 → 데이터 파일' },
  { attr: '세그먼트 관리', reth: 'DashMap으로 동시성 안전', geth: 'sync.RWMutex 잠금' },
  { attr: '대상 데이터', reth: 'Headers, TX, Receipts', geth: 'Headers, Bodies, Receipts, Hashes' },
];
