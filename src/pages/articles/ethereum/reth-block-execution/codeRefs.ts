import type { CodeRef } from '@/components/code/types';
import executorRs from './codebase/reth/crates/evm/src/executor.rs?raw';
import evmConfigRs from './codebase/reth/crates/revm/src/evm_config.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'block-executor': {
    path: 'reth/crates/evm/src/executor.rs',
    code: executorRs,
    lang: 'rust',
    highlight: [4, 29],
    desc: '문제: 블록 실행 결과를 즉시 DB에 쓰면 블록마다 I/O가 발생합니다.\n\n해결: BatchExecutor는 여러 블록의 상태 변경을 BundleState에 누적합니다. finalize()로 한 번에 반환하여 DB 쓰기를 최소화합니다.',
    annotations: [
      { lines: [10, 13], color: 'sky', note: 'BlockExecutor: 단일 블록 실행 + 검증' },
      { lines: [18, 26], color: 'emerald', note: 'BatchExecutor: 누적 실행 후 finalize()로 BundleState 반환' },
    ],
  },
  'evm-config': {
    path: 'reth/crates/revm/src/evm_config.rs',
    code: evmConfigRs,
    lang: 'rust',
    highlight: [4, 38],
    desc: '문제: revm의 Evm 인스턴스에 블록/TX 환경을 정확히 설정해야 합니다.\n\n해결: EvmConfig trait이 fill_block_env()와 fill_tx_env()를 제공합니다. 헤더에서 coinbase, timestamp, basefee 등을 추출하여 revm 환경에 매핑합니다.',
    annotations: [
      { lines: [8, 18], color: 'sky', note: 'fill_block_env: 헤더 → BlockEnv 매핑 (coinbase, basefee, prevrandao 등)' },
      { lines: [21, 32], color: 'emerald', note: 'fill_tx_env: TX → TxEnv 매핑 (caller, gas_limit, value, nonce 등)' },
    ],
  },
};
