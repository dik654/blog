export const C = { hs: '#6366f1', pbft: '#ef4444', hybrid: '#10b981', pipe: '#f59e0b' };

export const STEPS = [
  {
    label: 'HotStuff의 지연 문제',
    body: 'HotStuff는 O(n) 통신으로 확장성이 좋지만',
  },
  {
    label: 'PBFT의 처리량 한계',
    body: 'PBFT는 2단계 투표로 빠르게 커밋하지만',
  },
  {
    label: '하이브리드 접근: 두 장점 결합',
    body: 'Fast path: PBFT 스타일 2단계 (낮은 지연)',
  },
  {
    label: '파이프라인으로 처리량 극대화',
    body: '여러 합의 인스턴스를 동시 실행 — 리더가 돌아가며 블록 제안 → 파이프라인 효과',
  },
];
