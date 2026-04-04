import type { CodeRef } from '@/components/code/types';

import evmRs from './codebase/helios/execution/src/evm.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  // 본문 대응: ExecutionTrace Step0 — call() 전체 흐름
  // ProofDB 생성 → revm 빌드 → transact() → output 추출
  'hl-evm-call': {
    path: 'helios/execution/src/evm.rs',
    code: evmRs,
    lang: 'rust',
    highlight: [18, 37],
    desc: 'call() 전체 흐름. ProofDB::new()로 가상 DB 생성 → Evm::builder()로 revm 빌드 → transact()로 EVM 실행 → output() 반환. EVM 코드는 Reth와 동일하고 DB 레이어만 교체.',
    annotations: [
      { lines: [23, 26], color: 'emerald', note: '단계 1: ProofDB 생성 — lazy proof loading 담당' },
      { lines: [29, 32], color: 'amber', note: '단계 2: revm 빌더 — with_db(db)로 ProofDB 주입' },
      { lines: [35, 36], color: 'violet', note: '단계 3-4: transact() 실행 → output() 추출' },
    ],
  },

  // 본문 대응: ExecutionTrace Step2 — estimate_gas() + 10% 마진
  // call()과 동일 경로 + gas_used * 1.1
  'hl-evm-estimate': {
    path: 'helios/execution/src/evm.rs',
    code: evmRs,
    lang: 'rust',
    highlight: [40, 57],
    desc: 'estimate_gas() = call()과 동일 경로 + 10% 안전 마진. 블록 간 상태 변동(nonce, balance 변경)으로 예측과 실제 실행의 가스가 달라질 수 있어 마진을 추가한다.',
    annotations: [
      { lines: [44, 50], color: 'emerald', note: 'call()과 동일한 ProofDB + revm 빌드 경로' },
      { lines: [51, 51], color: 'sky', note: 'transact() 실행 — 동일한 EVM 엔진' },
      { lines: [54, 55], color: 'rose', note: '+10% 마진: gas + gas/10 — 상태 변동 흡수' },
    ],
  },
};
