export const C = { hash: '#8b5cf6', cache: '#10b981', slot: '#0ea5e9', epoch: '#f59e0b' };

export const STEPS = [
  {
    label: 'HashTreeRoot(ctx) 호출',
    body: 'dirty 필드만 재해시하여 현재 상태의 Merkle Root 생성',
  },
  {
    label: 'stateRoots 링 버퍼에 저장',
    body: 'stateRoots[slot % 8192] = root, 약 27시간분 보관',
  },
  {
    label: 'blockRoots 백필',
    body: '블록 헤더 루트를 blockRoots에 저장, LatestBlockHeader.StateRoot를 0→실제값',
  },
];
