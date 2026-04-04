export const C = { bls: '#6366f1', err: '#ef4444', ok: '#10b981', node: '#f59e0b', rand: '#8b5cf6' };

export const STEPS = [
  {
    label: '블록체인에서 편향 불가능한 랜덤이 필요',
    body: '추첨(Sortition): 누가 블록 생산자인가',
  },
  {
    label: '기존 방법의 한계',
    body: '단일 노드 랜덤: 자기에게 유리한 값 선택 가능',
  },
  {
    label: '해결: DRAND — t-of-n 임계값 서명',
    body: 'N개 노드가 각자 부분 서명을 제출 — 최소 t개가 모이면 집계 서명 완성',
  },
];
