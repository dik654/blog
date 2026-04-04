export const C = {
  lsm: '#ef4444',
  btree: '#6366f1',
  mdbx: '#10b981',
  dim: '#94a3b8',
};

export const STEPS = [
  {
    label: 'LSM-tree: 쓰기에 최적화된 구조',
    body: 'Memtable에 쓰고, flush 후 정렬된 SSTable 파일을 계층(L0→L6)으로 쌓습니다.\nCompaction이 백그라운드에서 파일을 병합하므로 쓰기 증폭(write amplification)은 낮지만, 읽기 시 여러 레벨을 탐색해야 합니다.',
  },
  {
    label: 'B+tree: 읽기에 최적화된 구조',
    body: '모든 데이터가 leaf에 정렬 저장됩니다.\n검색은 항상 root → leaf 경로(O(log n))를 따르며, 읽기 지연이 예측 가능합니다.',
  },
  {
    label: 'MDBX = LMDB 포크, B+tree 기반',
    body: 'Leonid Yuriev가 LMDB를 포크하여 개선한 엔진입니다.\n자동 geometry 확장, LIFO 페이지 회수, 안전한 reader 등록 등을 추가했습니다.',
  },
];
