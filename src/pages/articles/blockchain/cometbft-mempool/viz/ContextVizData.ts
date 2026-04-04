export const C = { mem: '#6366f1', check: '#10b981', recheck: '#f59e0b', err: '#ef4444', ok: '#8b5cf6' };

export const STEPS = [
  {
    label: '합의 전 TX 수집·검증·보관 버퍼가 필요',
    body: '사용자가 TX를 보내면 즉시 합의에 들어가지 않는다',
  },
  {
    label: '문제: 중복 TX, 무효 TX, 재검증',
    body: '1. 같은 TX가 여러 피어에서 도착 → 중복 삽입 방지',
  },
  {
    label: 'CListMempool — 이중 연결 리스트',
    body: 'clist.CList: 동시 읽기 안전한 linked list',
  },
  {
    label: 'CheckTx → ABCI 검증 → 수락/거부',
    body: 'TX 수신 → cache.Push()로 중복 체크',
  },
  {
    label: 'Recheck — 블록 후 재검증',
    body: '블록 커밋 후 Update() 호출:',
  },
];
