export const C = { hs: '#6366f1', jolt: '#10b981', ditto: '#f59e0b', diem: '#8b5cf6' };

export const STEPS = [
  {
    label: 'HotStuff의 응답성 한계',
    body: '정상 경로 3단계(7 delays) — 대부분 시간은 정상이므로 fast path 필요',
  },
  {
    label: 'Jolteon = HotStuff + 낙관적 응답성',
    body: 'Fast 2단계(4 delays) + Slow 3단계 fallback = PBFT 속도 + O(n) VC',
  },
  {
    label: 'Ditto = Jolteon + DAG fallback',
    body: '리더 장애 시 DAG가 TX 전파 유지 — Autobahn의 선행 연구',
  },
  {
    label: 'DiemBFT v4 = Aptos 합의',
    body: 'Jolteon + 리더 평판 시스템 — Aptos 메인넷의 실제 합의 엔진',
  },
];
