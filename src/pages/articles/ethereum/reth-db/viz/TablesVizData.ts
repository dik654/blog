export const C = {
  block: '#6366f1', state: '#10b981', trie: '#f59e0b',
  change: '#8b5cf6', idx: '#ef4444',
};

export const STEPS = [
  {
    label: 'tables! 매크로 — 전체 스키마 선언',
    body: 'tables! 매크로로 각 테이블의 Key/Value 타입을 선언하고 Enum+trait을 자동 생성합니다.',
  },
  {
    label: '블록 데이터 테이블 (4개)',
    body: 'Headers, BlockBodies, Transactions, Receipts 테이블이 블록 데이터를 저장합니다.',
  },
  {
    label: '상태 테이블 — PlainAccountState / PlainStorageState',
    body: 'DupSort로 같은 Address 아래 수천 스토리지 슬롯을 정렬 저장합니다.',
  },
  {
    label: 'Trie & ChangeSet 테이블',
    body: 'Trie(상태 루트), ChangeSet(블록별 이전값)으로 archive 없이 과거 상태를 복원합니다.',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'db-tables', 1: 'db-tables', 2: 'db-tables', 3: 'db-tables',
};
