export const C = { dag: '#10b981', wave: '#6366f1', anchor: '#f59e0b', order: '#8b5cf6' };

export const STEPS = [
  {
    label: 'DAG에서 순서가 필요한 이유',
    body: 'Narwhal DAG는 가용성만 보장 — 블록체인에는 전체 순서가 필요',
  },
  {
    label: '웨이브 기반 앵커',
    body: '2라운드 = 1웨이브, 짝수 라운드에서 앵커(리더 정점) 지정',
  },
  {
    label: '앵커 커밋 규칙',
    body: 'w+1 앵커가 w 앵커를 인과적으로 참조하면 커밋',
  },
  {
    label: '인과적 히스토리 정렬',
    body: '커밋된 앵커에서 역추적 → 도달 가능 정점을 결정론적 순서로 정렬',
  },
];
