import type { CodeRef } from '@/components/code/types';
import operationsRaw from './codebase/prysm/beacon-chain/core/blocks/block_operations.go?raw';

export const operationsCodeRefs: Record<string, CodeRef> = {
  'process-operations': {
    path: 'beacon-chain/core/blocks/block_operations.go — ProcessOperations()',
    lang: 'go',
    code: operationsRaw,
    highlight: [5, 44],
    desc: 'ProcessOperations — 블록 내 모든 오퍼레이션을 순차 처리',
    annotations: [
      { lines: [9, 14], color: 'sky', note: '1. ProposerSlashing: 이중 제안 검증자 처벌' },
      { lines: [16, 21], color: 'emerald', note: '2. AttesterSlashing: 이중 투표 검증자 처벌' },
      { lines: [23, 28], color: 'amber', note: '3. Attestation: 투표를 상태에 반영' },
      { lines: [30, 35], color: 'violet', note: '4. Deposit: 새 검증자 등록 처리' },
      { lines: [37, 42], color: 'rose', note: '5. VoluntaryExit: 자발적 이탈 처리' },
    ],
  },
};
