export const C = { rd: '#6366f1', wr: '#f59e0b', err: '#ef4444', ok: '#10b981', pg: '#8b5cf6' };

export const STEPS = [
  {
    label: '문제: 읽기 중 쓰기하면?',
    body: 'Writer가 페이지를 직접 수정하면 Reader가 반쯤 바뀐 데이터를 읽게 된다.',
  },
  {
    label: 'MVCC 해결: Copy-on-Write',
    body: 'Writer는 원본 페이지를 복사한 뒤 복사본을 수정한다. Reader는 원본을 계속 참조한다.',
  },
  {
    label: 'txnid로 버전 관리',
    body: '각 트랜잭션에 고유 ID. Reader(txnid=5)는 5 시점의 트리를, Writer(txnid=6)는 새 트리를 본다.',
  },
  {
    label: 'Reth에서의 효과',
    body: 'EVM 블록 실행(writer)과 RPC 잔액 조회(reader)가 lock 없이 동시 진행된다.',
  },
];
