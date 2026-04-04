export const C = {
  reader: '#6366f1',
  writer: '#10b981',
  gc: '#f59e0b',
  txn: '#0ea5e9',
  dim: '#94a3b8',
};

export const STEPS = [
  {
    label: 'MVCC: 다중 버전 동시성 제어',
    body: 'Multi-Version Concurrency Control.\n같은 데이터의 여러 버전을 동시에 유지하여 읽기/쓰기가 서로를 차단하지 않습니다.',
  },
  {
    label: '읽기 트랜잭션: 시작 시점의 스냅샷',
    body: '읽기 트랜잭션은 시작할 때의 meta 페이지(txnid=N)를 참조합니다.\n이후 쓰기가 발생해도 읽기 트랜잭션은 항상 일관된 뷰(consistent view)를 유지합니다.',
  },
  {
    label: '쓰기 트랜잭션: 동시에 1개만 (Single Writer)',
    body: 'MDBX는 쓰기 트랜잭션을 직렬화합니다.\n쓰기 잠금(write mutex)으로 동시에 하나만 쓰기가 가능하므로 WAL(Write-Ahead Log)이 필요 없습니다.',
  },
  {
    label: 'txnid: 트랜잭션 고유 ID',
    body: '매 쓰기 커밋마다 txnid가 1씩 증가합니다.\n수정된 페이지에 txnid가 기록되어, 어떤 트랜잭션이 해당 페이지를 만들었는지 추적할 수 있습니다.',
  },
  {
    label: 'GC(Freelist): 오래된 페이지 재활용',
    body: '어떤 읽기 트랜잭션도 참조하지 않는 old page는 GC(Garbage Collection)에 의해 freelist에 반환됩니다.\nMDBX는 LIFO 순서로 회수하여 캐시 지역성을 높입니다.',
  },
];
