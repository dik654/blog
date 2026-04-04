export const C = { tx: '#6366f1', cache: '#f59e0b', abci: '#10b981', err: '#ef4444' };

export const STEPS = [
  {
    label: 'CheckTx() 진입 — 중복·용량 체크',
    body: 'proxyMtx.Lock() — 동시 CheckTx 직렬화',
  },
  {
    label: 'preCheck → ABCI CheckTxAsync',
    body: 'preCheck(tx): 선택적 경량 검증 (크기 등)',
  },
  {
    label: 'reqResCb — code==0이면 addTx()',
    body: 'ABCI 응답 콜백: — code == 0: addTx() → CList.PushBack(memTx)',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'clist-checktx', 1: 'clist-checktx', 2: 'clist-addtx',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'clist_mempool.go — CheckTx() 진입',
  1: 'clist_mempool.go — preCheck + CheckTxAsync',
  2: 'clist_mempool.go — reqResCb + addTx',
};
