export const C = { pbft: '#6366f1', hs: '#10b981', chain: '#f59e0b', err: '#ef4444' };

export const STEPS = [
  {
    label: 'PBFT View Change: O(n³)',
    body: 'PBFT View Change O(n³) → 네트워크 불안정 시 Hangover 현상',
  },
  {
    label: 'HotStuff: O(n) 선형 통신',
    body: 'Star topology + Threshold Sig → 정상/VC 모두 O(n)',
  },
  {
    label: '기본 HotStuff: 3단계 투표',
    body: '4단계 투표로 7 message delays — PBFT(5)보다 길지만 O(n)',
  },
  {
    label: '체인 HotStuff: 파이프라인화',
    body: '3단계를 view 간 파이프라인으로 겹쳐 매 view마다 1블록 확정',
  },
];
