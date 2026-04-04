import type { CodeRef } from '@/components/code/types';
import committeeRaw from './codebase/prysm/beacon-chain/core/helpers/committee.go?raw';

export const committeeCodeRefs: Record<string, CodeRef> = {
  'compute-proposer': {
    path: 'beacon-chain/core/helpers/committee.go — ComputeProposerIndex()',
    lang: 'go',
    code: committeeRaw,
    highlight: [5, 29],
    desc: 'ComputeProposerIndex — RANDAO 기반 셔플로 제안자 선정',
    annotations: [
      { lines: [10, 11], color: 'sky', note: '빈 활성 인덱스 방어' },
      { lines: [14, 19], color: 'emerald', note: 'ComputeShuffledIndex: RANDAO 시드로 후보 선택' },
      { lines: [21, 22], color: 'amber', note: '해시 기반 랜덤 바이트 추출' },
      { lines: [24, 27], color: 'violet', note: '유효 잔액 비례 확률 체크 (높을수록 유리)' },
    ],
  },
};
