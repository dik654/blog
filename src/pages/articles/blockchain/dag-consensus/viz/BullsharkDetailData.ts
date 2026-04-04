export const ANCHOR_STEPS = [
  {
    label: '앵커 선출 — 짝수 라운드',
    body: '매 짝수 라운드(2, 4, 6 ...)에서 "앵커(anchor)" 선출',
  },
  {
    label: '2f+1 참조 → 커밋',
    body: '다음 라운드의 2f+1 Vertex가 앵커를 parent로 참조',
  },
  {
    label: 'Linearization — 전체 순서 결정',
    body: 'BFS로 앵커의 ancestors 수집',
  },
  {
    label: 'Wave 구조 — 4라운드 단위',
    body: 'Wave = [투표] [앵커] [투표] [앵커]',
  },
];
