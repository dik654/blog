export const C = {
  mdbx: '#6366f1', static: '#10b981', seg: '#f59e0b', benefit: '#8b5cf6',
};

export const STEPS = [
  {
    label: 'StaticFileProvider — 고대 데이터 분리',
    body: 'finalized 이전 불변 데이터를 MDBX에서 flat file로 아카이브합니다(Geth Freezer 역할).',
  },
  {
    label: '3가지 세그먼트: Headers / TX / Receipts',
    body: '세그먼트별 flat file에 블록 번호=오프셋으로 O(1) 접근합니다.',
  },
  {
    label: '분리의 이점',
    body: 'DB 크기 감소로 B+tree가 얕아지고 순차 읽기와 pruning이 세그먼트별 독립 관리됩니다.',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'db-static-file', 1: 'db-static-file', 2: 'db-static-file',
};
