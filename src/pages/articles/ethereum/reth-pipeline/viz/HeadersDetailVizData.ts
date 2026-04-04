export const C = { range: '#6366f1', peer: '#f59e0b', valid: '#10b981', db: '#8b5cf6', check: '#0ea5e9' };

export const STEPS = [
  {
    label: 'input.next_block_range()',
    body: 'CL의 target 해시와 DB 체크포인트를 비교하여 다운로드할 헤더 범위를 계산합니다.',
  },
  {
    label: 'downloader.stream_headers(range)',
    body: 'devp2p로 여러 피어에게 GetBlockHeaders를 요청하고 가장 빠른 응답을 스트림 수신합니다.',
  },
  {
    label: 'validate_header(header, parent)',
    body: 'parent_hash, 블록 번호 연속성, 타임스탬프 순서를 검증하여 위조를 방지합니다.',
  },
  {
    label: 'provider.insert_headers(batch)',
    body: '검증된 헤더를 commit_threshold(10,000) 단위로 MDBX에 배치 삽입합니다.',
  },
  {
    label: 'StageCheckpoint::new(end)',
    body: '체크포인트를 저장하여 크래시 후 이 블록+1부터 이어서 다운로드합니다.',
  },
];
