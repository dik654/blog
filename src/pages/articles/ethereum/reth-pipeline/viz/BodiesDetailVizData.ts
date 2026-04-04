export const C = { range: '#6366f1', peer: '#f59e0b', valid: '#10b981', db: '#8b5cf6', check: '#0ea5e9' };

export const STEPS = [
  {
    label: 'input.next_block_range()',
    body: 'HeadersStage 체크포인트 기준으로 바디를 채울 범위(checkpoint+1 ~ target)를 결정합니다.',
  },
  {
    label: 'downloader.stream_bodies(headers)',
    body: 'DB의 헤더 목록으로 여러 피어에 병렬 GetBlockBodies 요청을 전달합니다.',
  },
  {
    label: 'tx_root == DeriveSha(txs)?',
    body: 'TX 목록으로 머클 루트를 직접 계산하여 헤더의 transactions_root와 대조 검증합니다.',
  },
  {
    label: 'provider.insert_block_bodies(batch)',
    body: '검증된 (헤더, 바디) 쌍을 MDBX BlockBodies/Transactions 테이블에 저장합니다.',
  },
  {
    label: 'StageCheckpoint::new(end)',
    body: '체크포인트 저장으로 크래시 복구와 SendersStage의 입력 범위를 결정합니다.',
  },
];
