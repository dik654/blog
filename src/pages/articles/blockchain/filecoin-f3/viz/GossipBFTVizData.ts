export const C = {
  ec: '#6366f1',
  f3: '#10b981',
  vote: '#f59e0b',
  cert: '#8b5cf6',
  err: '#ef4444',
};

export const STEPS = [
  {
    label: 'RunToCompletion 진입',
    body: 'for r.phase <= DECIDE — 5단계를 순차 실행하는 루프',
  },
  {
    label: 'QUALITY → CONVERGE (후보 선택)',
    body: 'QUALITY: "이 tipset이 유효한가?" — 품질 초기 투표',
  },
  {
    label: 'PREPARE → COMMIT (확정 합의)',
    body: 'PREPARE: 수렴된 tipset에 BLS 서명 → 2/3+ 파워 동의',
  },
  {
    label: 'DECIDE → 인증서 발행',
    body: '모든 단계 통과 → buildCertificate() 호출',
  },
  {
    label: '왜 GossipSub인가',
    body: '전통 PBFT: O(n²) 메시지 복잡도 → 수백 노드 한계',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'gpbft-run', 1: 'gpbft-run', 2: 'gpbft-run', 3: 'f3-run', 4: 'gpbft-run',
};
