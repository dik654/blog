export interface SyncMode {
  id: string;
  label: string;
  role: string;
  details: string;
  why: string;
  color: string;
}

export const SYNC_MODES: SyncMode[] = [
  {
    id: 'full',
    label: 'Full Sync',
    role: '제네시스부터 전체 검증',
    details:
      'Pipeline에 등록된 Stage를 순서대로 실행한다. Headers → Bodies → Execution → Merkle 순으로 tip까지 진행. ' +
      '모든 블록을 직접 실행하므로 Archive 노드에 적합.',
    why: '왜 느려도 쓰나? 모든 상태 전이를 직접 검증하므로 신뢰가 필요 없다. 보안이 중요한 인프라에 필수.',
    color: '#6366f1',
  },
  {
    id: 'snap',
    label: 'Snap Sync',
    role: '최신 상태 직접 다운로드',
    details:
      '전체 블록을 재실행하지 않고 피어에서 최신 상태를 직접 다운로드한다. ' +
      'Merkle proof로 각 청크의 무결성을 검증하여 보안성은 Full Sync와 동일.',
    why: '왜 빠른가? 중간 상태를 건너뛴다. 2억 블록 실행 대신 현재 상태만 받으므로 수일 → 수시간.',
    color: '#0ea5e9',
  },
  {
    id: 'live',
    label: 'Live Sync',
    role: '실시간 블록 추적',
    details:
      '최신 블록에 도달하면 자동 전환된다. BlockchainTree가 새 블록을 수신하고, ' +
      'reorg(체인 재구성) 발생 시 공통 조상까지 되감아 새 체인으로 전환.',
    why: '왜 별도 모드? Pipeline은 배치 처리에 최적화되어 있어, 단일 블록 처리에는 오버헤드가 크다.',
    color: '#10b981',
  },
];

export interface SyncComparison {
  aspect: string;
  full: string;
  snap: string;
  live: string;
}

export const SYNC_COMPARISONS: SyncComparison[] = [
  { aspect: '소요 시간', full: '수일', snap: '수시간', live: '실시간' },
  { aspect: '디스크 사용', full: '~2TB (Archive)', snap: '~500GB', live: '증분' },
  { aspect: '검증 방식', full: '모든 블록 실행', snap: 'Merkle proof', live: '단일 블록 실행' },
  { aspect: '사용 시점', full: '초기 동기화', snap: '초기 동기화', live: '동기화 완료 후' },
];
