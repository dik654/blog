export const C = { block: '#8b5cf6', remove: '#ef4444', recheck: '#f59e0b', ok: '#10b981' };

export const STEPS = [
  {
    label: 'Update() — 블록 커밋 후 호출',
    body: 'height 업데이트 — 블록에 포함된 TX를 txByKey로 찾아 제거',
  },
  {
    label: 'recheckTxs() — 남은 TX 재검증',
    body: 'CList.Front()부터 순회 — 각 TX를 ABCI CheckTx(type=Recheck)로 전송',
  },
  {
    label: 'Recheck 결과 처리',
    body: 'resCbRecheck 콜백: — code=0: TX 유지 (여전히 유효)',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'clist-update', 1: 'clist-recheck', 2: 'clist-recheck',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'clist_mempool.go — Update()',
  1: 'clist_mempool.go — recheckTxs()',
  2: 'clist_mempool.go — resCbRecheck',
};
