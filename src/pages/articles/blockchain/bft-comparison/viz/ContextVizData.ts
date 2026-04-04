export const C = { byz: '#ef4444', pbft: '#6366f1', hs: '#10b981', ab: '#f59e0b' };

export const STEPS = [
  {
    label: '왜 BFT가 필요한가',
    body: '분산 네트워크에서 일부 노드가 악의적으로 행동할 수 있음',
  },
  {
    label: '문제: PBFT O(n²) 통신',
    body: 'PBFT(1999)는 최초의 실용 BFT',
  },
  {
    label: '문제: 리더 장애 시 O(n³) 복구',
    body: 'PBFT의 View Change(리더 교체) 비용이 O(n³)',
  },
  {
    label: '해결 1: HotStuff 선형 통신',
    body: 'Star topology — 모든 통신이 리더를 경유',
  },
  {
    label: '해결 2: Autobahn 하이브리드',
    body: 'Highway(합의) + Lanes(데이터)를 분리',
  },
];
