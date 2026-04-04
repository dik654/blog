export const C = { block: '#6366f1', part: '#0ea5e9', commit: '#10b981', db: '#8b5cf6' };

export const STEPS = [
  {
    label: 'BlockStore — LevelDB 기반 블록 저장소',
    body: 'db, base(최저 높이), height(최고 높이) 필드',
  },
  {
    label: 'SaveBlock — 블록을 파트 단위로 분리 저장',
    body: 'BlockMeta — 헤더 해시, 파트셋 헤더, 블록 크기',
  },
  {
    label: 'LoadBlock — 파트 조합 → 완성 블록',
    body: 'LoadBlockMeta(h) → 파트 개수 확인',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'block-store', 1: 'block-save', 2: 'block-store',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'store.go — BlockStore struct',
  1: 'store.go — SaveBlock()',
  2: 'store.go — LoadBlock()',
};
