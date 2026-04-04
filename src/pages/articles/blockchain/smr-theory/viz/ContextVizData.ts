export const C = { smr: '#6366f1', log: '#10b981', paxos: '#f59e0b', err: '#ef4444' };

export const STEPS = [
  {
    label: '왜 상태 머신 복제가 필요한가',
    body: '서버 하나가 죽으면 서비스 전체가 중단',
  },
  {
    label: '핵심: 전체 순서 + 결정론적 실행',
    body: '모든 복제본이 같은 초기 상태에서 같은 순서로 같은 명령 실행 → 동일 결과 보장',
  },
  {
    label: '문제: 합의 없이는 순서 불일치',
    body: '네트워크 지연, 재전송, 패킷 순서 변경',
  },
  {
    label: '해결: Paxos → Raft → BFT',
    body: 'Paxos(1998) — 최초의 합의 알고리즘, 이해 난해',
  },
];
