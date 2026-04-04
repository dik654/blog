export const C = {
  sync: '#6366f1', valid: '#10b981',
  err: '#ef4444', state: '#f59e0b', msg: '#8b5cf6',
};

export const STEP_REFS: Record<number, string> = {
  0: 'chain-sync', 1: 'chain-sync',
  2: 'chain-sync', 3: 'state-apply',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'sync.go — Syncer.Sync()',
  1: 'sync.go — collectHeaders()',
  2: 'sync.go — ValidateBlock()',
  3: 'stmgr.go — ApplyBlocks()',
};

export const STEPS = [
  {
    label: '부트스트랩: 네트워크 참여',
    body: 'GossipSub으로 피어 연결 → heaviest tipset 정보 수신',
  },
  {
    label: '헤더 역순 수집 (collectHeaders)',
    body: 'Syncer.Sync() 1단계: 최신 tipset → 제네시스 방향 탐색',
  },
  {
    label: '메시지 수집 + 블록 검증',
    body: 'collectMessages(): Bitswap P2P로 각 블록의 메시지 CID 요청',
  },
  {
    label: 'FVM 상태 계산 (ApplyBlocks)',
    body: 'StateManager.ApplyBlocks()가 FVM 인스턴스 생성',
  },
];
