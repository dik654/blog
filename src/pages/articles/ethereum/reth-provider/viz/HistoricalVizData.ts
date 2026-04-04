export const C = {
  current: '#10b981', change: '#f59e0b', past: '#6366f1',
  db: '#8b5cf6', table: '#0ea5e9', key: '#64748b',
};

export const STEPS = [
  {
    label: 'ChangeSet — "변경 전 값"을 기록하는 테이블',
    body: 'AccountChangeSets는 계정의 이전 잔액/nonce를, StorageChangeSets는 스토리지 슬롯의 이전 값을 저장한다.\n역방향 적용의 핵심 재료다.',
  },
  {
    label: '역추적 — 현재에서 과거로 패치 적용',
    body: '현재 상태에서 출발해, 최신 ChangeSet부터 역순으로 old_value를 적용한다.\n100블록 전 상태를 조회하면 100번의 패치가 필요하다.',
  },
  {
    label: 'AccountChangeSets 테이블 구조',
    body: 'Key: (BlockNumber, Address) 복합 키로 B+tree 범위 스캔에 최적화.\n같은 블록의 모든 변경을 한 번에 순회할 수 있다.',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'changeset-tables',
  1: 'changeset-tables',
  2: 'changeset-tables',
};
