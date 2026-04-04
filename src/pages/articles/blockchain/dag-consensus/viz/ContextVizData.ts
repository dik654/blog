export const C = { chain: '#6366f1', dag: '#10b981', err: '#ef4444', leader: '#f59e0b' };

export const STEPS = [
  {
    label: '왜 DAG가 필요한가',
    body: '전통 블록체인은 한 번에 하나의 블록만 제안 가능',
  },
  {
    label: '문제: 리더 병목',
    body: '리더 기반 합의(PBFT, HotStuff)는 리더가 단일 장애점',
  },
  {
    label: '문제: 순차 합의의 처리량 한계',
    body: '블록 1 합의 완료 → 블록 2 시작 → 완료 → 블록 3 시작',
  },
  {
    label: '해결: DAG로 병렬 제안',
    body: 'Narwhal — 모든 검증자가 매 라운드 동시에 vertex 제출',
  },
  {
    label: '해결: Zero-message 합의',
    body: 'Bullshark — DAG 구조만으로 전체 순서 결정',
  },
];
