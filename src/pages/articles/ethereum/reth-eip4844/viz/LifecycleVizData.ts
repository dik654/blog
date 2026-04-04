export const C = { pool: '#6366f1', chain: '#10b981', finalize: '#f59e0b', reorg: '#ef4444' };

export const STEPS = [
  {
    label: 'Blob TX 풀 진입',
    body: 'stateless→stateful 검증 후 BlobStore에 사이드카를 저장하고 풀에 TX 본체만 유지합니다.',
  },
  {
    label: '블록 포함 + 추적',
    body: 'BlobStoreCanonTracker가 is_eip4844() 필터로 blob TX를 블록 번호순 추적합니다.',
  },
  {
    label: 'Finalization 정리',
    body: 'on_finalized_block(N)으로 블록 N까지의 blob TX를 BlobStore에서 일괄 삭제합니다.',
  },
  {
    label: 'Re-org 재주입',
    body: '체인 재구성 시 BlobStore에 이미 저장된 blob이면 KZG 재검증을 생략하고 재주입합니다.',
  },
];
