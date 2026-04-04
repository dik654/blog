import type { CodeRef } from '@/components/code/types';
import rewardRaw from './codebase/prysm/beacon-chain/core/epoch/precompute/reward_penalty.go?raw';

export const rewardCodeRefs: Record<string, CodeRef> = {
  'process-rewards': {
    path: 'beacon-chain/core/epoch/precompute/reward_penalty.go — ProcessRewardsAndPenalties()',
    lang: 'go',
    code: rewardRaw,
    highlight: [19, 38],
    desc: 'ProcessRewardsAndPenalties — 어테스테이션 참여도 기반 보상/패널티 적용',
    annotations: [
      { lines: [20, 21], color: 'sky', note: '제네시스 에폭 스킵' },
      { lines: [23, 24], color: 'emerald', note: '사전 계산: base reward, proposer reward 등' },
      { lines: [27, 27], color: 'amber', note: 'AttestationsDelta: 개별 보상/패널티 벡터' },
      { lines: [31, 36], color: 'violet', note: '잔액 업데이트 (오버플로우 방지)' },
    ],
  },
  'process-slashings': {
    path: 'beacon-chain/core/epoch/precompute/reward_penalty.go — AttestingBalance()',
    lang: 'go',
    code: rewardRaw,
    highlight: [4, 15],
    desc: 'AttestingBalance — 특정 체크포인트에 투표한 검증자들의 총 잔액',
    annotations: [
      { lines: [7, 8], color: 'sky', note: '슬래싱된 검증자 제외' },
      { lines: [10, 11], color: 'emerald', note: '타겟 투표 여부 확인 → 잔액 합산' },
    ],
  },
};
