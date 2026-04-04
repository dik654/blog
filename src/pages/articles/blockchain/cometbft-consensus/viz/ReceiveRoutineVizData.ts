export const C = { peer: '#6366f1', internal: '#f59e0b', timeout: '#ef4444', handler: '#10b981', wal: '#8b5cf6' };

export const STEPS = [
  {
    label: 'receiveRoutine — 단일 goroutine',
    body: '단일 goroutine에서 순차 처리 — 락 없이 채널 직렬화로 동시성 제거',
  },
  {
    label: 'peerMsgQueue 처리',
    body: '피어 Proposal/Vote/BlockPart → WAL 비동기 기록 → handleMsg 디스패치',
  },
  {
    label: 'internalMsgQueue 처리',
    body: '자신의 Vote/Proposal → WAL 동기 기록(WriteSync) → handleMsg 디스패치',
  },
  {
    label: 'handleMsg 디스패치',
    body: 'Proposal→setProposal, BlockPart→addPart, Vote→tryAddVote로 디스패치',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'receive-routine', 1: 'receive-routine', 2: 'receive-routine', 3: 'handle-msg',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'state.go — receiveRoutine()', 1: 'state.go — peerMsgQueue → wal.Write',
  2: 'state.go — internalMsgQueue → wal.WriteSync', 3: 'state.go — handleMsg() 디스패치',
};
