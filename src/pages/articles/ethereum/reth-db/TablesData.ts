export const TABLE_GROUPS = [
  {
    title: '블록 데이터 테이블 (4개)',
    color: 'sky',
    tables: [
      { name: 'Headers', key: 'BlockNumber', value: 'Header', note: '블록 헤더 (부모 해시, 상태 루트, 타임스탬프 등)' },
      { name: 'BlockBodies', key: 'BlockNumber', value: 'StoredBlockBody', note: 'TX 인덱스 범위 — 실제 TX는 Transactions 테이블에 저장' },
      { name: 'Transactions', key: 'TxNumber', value: 'TransactionSigned', note: '글로벌 TX 번호로 인덱싱 — 블록과 독립적 조회 가능' },
      { name: 'Receipts', key: 'TxNumber', value: 'Receipt', note: '실행 결과 — gasUsed, 로그, 상태 코드' },
    ],
  },
  {
    title: '상태 테이블 (최신 스냅샷)',
    color: 'emerald',
    tables: [
      { name: 'PlainAccountState', key: 'Address', value: 'Account', note: '계정의 nonce, balance, code_hash' },
      { name: 'PlainStorageState', key: 'Address', value: '(StorageKey, Value)', note: 'DupSort — 같은 주소 아래 수천 슬롯을 정렬 저장' },
      { name: 'Bytecodes', key: 'B256 (code_hash)', value: 'Bytecode', note: '컨트랙트 바이트코드 — code_hash로 중복 제거' },
    ],
  },
  {
    title: 'Trie & ChangeSet 테이블',
    color: 'amber',
    tables: [
      { name: 'AccountsTrie', key: 'Nibbles', value: 'BranchNodeCompact', note: '상태 루트 계산용 — MPT(Merkle Patricia Trie) 노드' },
      { name: 'AccountChangeSets', key: 'BlockNumber', value: 'AccountBeforeTx', note: '블록별 계정 변경 이전값 — 과거 상태 복원에 사용' },
    ],
  },
];

export const WHY_SEPARATE_TABLES = [
  {
    question: '왜 Headers와 Bodies를 분리하는가?',
    answer: '헤더는 합의 검증에, 바디는 실행에 필요하다. P2P 헤더 동기화 시 바디를 읽을 필요가 없다. 테이블을 분리하면 B+tree가 더 얕아지고 캐시 효율이 높아진다.',
  },
  {
    question: '왜 TX를 블록이 아닌 글로벌 번호로 인덱싱하는가?',
    answer: 'eth_getTransactionByHash RPC는 블록 번호를 모른 채 TX를 조회한다. 글로벌 TxNumber로 인덱싱하면 TransactionHashNumbers 테이블에서 해시 → 번호 변환 후 O(1) 접근이 가능하다.',
  },
  {
    question: 'DupSort란 무엇인가?',
    answer: 'MDBX의 기능으로, 하나의 키에 여러 값을 정렬 저장한다. PlainStorageState에서 같은 Address 아래 수천 개의 스토리지 슬롯을 효율적으로 범위 조회할 수 있다.',
  },
];
