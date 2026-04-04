export const C = {
  block: '#6366f1',
  tx: '#0ea5e9',
  revm: '#f59e0b',
  state: '#10b981',
};

export const STEPS = [
  {
    label: 'Why: 블록 실행이 왜 분리되어야 하는가?',
    body: 'CPU 집약(EVM)과 I/O 집약(DB) 분리로 배치 처리 및 trait 교체가 가능합니다.',
  },
  {
    label: '블록 → TX 추출 → revm 실행',
    body: '블록에서 TX를 꺼내 fill_tx_env()로 revm 환경 설정 후 실행합니다.',
  },
  {
    label: 'EvmConfig: 블록/TX 환경 설정',
    body: 'fill_block_env/fill_tx_env trait으로 체인별 커스텀이 가능합니다.',
  },
  {
    label: '상태 변경 → BundleState에 수집',
    body: 'revm 실행 결과(잔액, 스토리지, 배포)가 BundleState HashMap에 누적됩니다.',
  },
  {
    label: 'BundleState → DB 일괄 기록',
    body: 'finalize()로 반환된 BundleState를 write_to_storage()로 MDBX에 배치 커밋합니다.',
  },
];
