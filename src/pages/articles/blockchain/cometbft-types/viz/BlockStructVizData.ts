export const C = { header: '#6366f1', data: '#10b981', commit: '#8b5cf6', hash: '#f59e0b' };

export const STEPS = [
  {
    label: 'Block 구조체 — Header + Data + Evidence + LastCommit',
    body: 'types/block.go의 Block struct',
  },
  {
    label: 'Header — 14개 필드를 Merkle 해시',
    body: 'Header.Hash()는 14개 필드를 cdcEncode 후',
  },
  {
    label: 'Data.Hash() — TX 머클 루트',
    body: 'Tx = []byte (앱이 해석 결정)',
  },
  {
    label: 'MakePartSet() — 64KB 조각으로 분할',
    body: 'protobuf 직렬화 → 64KB 청크(Part)로 분할',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'block-struct', 1: 'header-hash', 2: 'data-hash', 3: 'make-partset',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'block.go — Block struct',
  1: 'block.go — Header.Hash()',
  2: 'block.go — Data.Hash()',
  3: 'block.go — MakePartSet()',
};
