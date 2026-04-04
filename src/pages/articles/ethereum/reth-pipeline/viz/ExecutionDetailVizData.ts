export const C = { range: '#6366f1', exec: '#f59e0b', state: '#10b981', db: '#8b5cf6', check: '#0ea5e9' };

export const STEPS = [
  {
    label: 'input.next_block_range()',
    body: 'CL tip과 DB 체크포인트로 실행할 블록 범위를 계산합니다.',
  },
  {
    label: 'batch_executor() 생성',
    body: 'revm 배치 실행기를 생성하고 최신 DB 상태를 바인딩합니다.',
  },
  {
    label: 'sealed_block_with_senders(n)',
    body: 'DB에서 헤더+바디+sender를 로드하여 완성 블록을 조합합니다.',
  },
  {
    label: 'execute_and_verify_one(block)',
    body: '블록 TX를 revm으로 실행하고 결과를 BundleState에 누적합니다.',
  },
  {
    label: 'commit_threshold 체크',
    body: '10,000블록마다 BundleState를 DB에 중간 저장하여 크래시 복구 범위를 제한합니다.',
  },
  {
    label: 'finalize().write_to_storage()',
    body: '남은 상태 변경을 MDBX에 기록하고 MerkleStage가 PrefixSet으로 루트를 계산합니다.',
  },
];
