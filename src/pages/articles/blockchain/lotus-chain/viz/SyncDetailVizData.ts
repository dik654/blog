export const C = {
  sync: '#6366f1', valid: '#10b981', state: '#f59e0b', msg: '#8b5cf6',
};

export const STEP_REFS: Record<number, string> = {
  0: 'chain-sync', 1: 'chain-sync',
  2: 'chain-sync', 3: 'state-apply',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'sync.go L27 — collectHeaders()',
  1: 'sync.go L32 — collectMessages()',
  2: 'sync.go L37 — ValidateBlock()',
  3: 'stmgr.go L20 — ApplyBlocks()',
};

export const STEPS = [
  {
    label: 'collectHeaders(): 역순 헤더 수집',
    body: 'Syncer.Sync() 1단계 — s.collectHeaders(ctx, maybeHead, heaviest)',
  },
  {
    label: 'collectMessages(): Bitswap P2P 수집',
    body: '2단계 — 각 블록의 메시지 CID를 Bitswap으로 요청',
  },
  {
    label: 'ValidateBlock(): 4항목 검증',
    body: '3단계 — 체인의 각 tipset을 순회하며 검증',
  },
  {
    label: 'ApplyBlocks(): FVM 상태 실행',
    body: '4단계 — StateManager.ApplyBlocks(ctx, chain)',
  },
];
