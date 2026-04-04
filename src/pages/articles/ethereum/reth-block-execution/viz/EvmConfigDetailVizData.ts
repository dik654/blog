export const C = { header: '#6366f1', block: '#0ea5e9', tx: '#f59e0b', revm: '#10b981' };

export const STEPS = [
  {
    label: 'EvmConfig trait 역할',
    body: 'revm Evm에 블록/TX 환경을 주입하는 trait으로 체인별 교체가 가능합니다.',
  },
  {
    label: 'fill_block_env(header)',
    body: '헤더에서 number, coinbase, timestamp, basefee 등 블록 환경 변수를 추출합니다.',
  },
  {
    label: 'fill_tx_env(tx, sender)',
    body: 'TX에서 caller, gas_limit, value, nonce 등 실행 환경 변수를 추출합니다.',
  },
  {
    label: 'revm Evm 인스턴스 생성',
    body: 'BlockEnv+TxEnv 설정 후 revm::Evm::new()로 StateProvider를 바인딩합니다.',
  },
];
