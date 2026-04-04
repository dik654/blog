export const C = { sync: '#6366f1', async: '#f59e0b', partial: '#10b981', err: '#ef4444' };

export const STEPS = [
  {
    label: '왜 분산 시스템 이론이 필요한가',
    body: '블록체인 = 분산 시스템의 구현체 — 합의, 장애 허용, 일관성의 이론적 한계를 이해해야',
  },
  {
    label: '한계: CAP 정리',
    body: '분산 시스템은 C, A, P 중 최대 2가지만 동시 보장',
  },
  {
    label: '한계: FLP 불가능성',
    body: 'Fischer, Lynch, Paterson (1985)',
  },
  {
    label: '해결: 부분 동기 + 확률적 합의',
    body: '부분 동기 모델 — GST 이후 동기 보장 가정',
  },
];
