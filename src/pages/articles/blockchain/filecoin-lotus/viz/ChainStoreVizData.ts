export const BLOCKS = [
  { label: 'chainBlockstore', sub: '블록 헤더 + 메시지', color: '#3b82f6' },
  { label: 'stateBlockstore', sub: '상태 트리 (HAMT/AMT)', color: '#10b981' },
  { label: 'heaviest', sub: '현재 head TipSet', color: '#8b5cf6' },
  { label: 'tsCache (ARC)', sub: 'TipSet 캐시 8192개', color: '#f59e0b' },
  { label: 'mmCache (ARC)', sub: 'MsgMeta 캐시 2048개', color: '#ec4899' },
  { label: 'reorgCh', sub: '리오그 알림 채널', color: '#ef4444' },
];

export const STEPS = [
  {
    label: 'chain / state Blockstore 분리',
    body: 'chainBlockstore — 블록 헤더와 메시지 저장',
  },
  {
    label: 'heaviest TipSet 추적',
    body: 'heaviest *types.TipSet — 항상 가장 무거운 체인 헤드 유지',
  },
  {
    label: 'ARC 캐시 — 디스크 접근 최소화',
    body: 'tsCache: TipSetKey → *TipSet (기본 8192 엔트리)',
  },
  {
    label: 'reorgCh — 체인 재구성 알림',
    body: 'reorgCh chan<- reorg — 백그라운드 goroutine이 처리',
  },
  {
    label: 'NewChainStore() 초기화 흐름',
    body: '1. ARC 캐시 2개 생성 (MsgMeta + TipSet)',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'lotus-chainstore',
  1: 'lotus-chainstore',
  2: 'lotus-chainstore',
  3: 'lotus-chainstore',
  4: 'lotus-chainstore',
};
