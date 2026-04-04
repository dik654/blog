export const C = { list: '#6366f1', add: '#10b981', del: '#ef4444', wait: '#f59e0b' };

export const STEPS = [
  {
    label: 'CList — concurrent linked list 구조',
    body: 'clist.CList: 이중 연결 리스트 + rwMutex',
  },
  {
    label: 'PushBack() — O(1) 삽입',
    body: '리스트 끝에 새 CElement 추가',
  },
  {
    label: 'Remove() — O(1) 삭제',
    body: '블록에 포함된 TX를 리스트에서 제거',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'clist-struct', 1: 'clist-addtx', 2: 'clist-update',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'clist_mempool.go — CListMempool struct',
  1: 'clist_mempool.go — addTx()',
  2: 'clist_mempool.go — Update() removeTx()',
};
