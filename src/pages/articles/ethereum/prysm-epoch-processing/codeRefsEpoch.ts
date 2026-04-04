import type { CodeRef } from '@/components/code/types';
import epochRaw from './codebase/prysm/beacon-chain/core/epoch/epoch_processing.go?raw';

export const epochCodeRefs: Record<string, CodeRef> = {
  'process-epoch': {
    path: 'beacon-chain/core/epoch/epoch_processing.go — ProcessEpoch()',
    lang: 'go',
    code: epochRaw,
    highlight: [5, 43],
    desc: 'ProcessEpoch — 에폭 경계에서 실행되는 7단계 상태 전이 파이프라인',
    annotations: [
      { lines: [7, 10], color: 'sky', note: '1단계: Justification & Finalization' },
      { lines: [12, 15], color: 'emerald', note: '2단계: Inactivity Scores (Altair+)' },
      { lines: [17, 20], color: 'amber', note: '3단계: 보상 & 패널티 계산' },
      { lines: [22, 25], color: 'violet', note: '4단계: 검증자 활성화/이탈 큐' },
      { lines: [27, 30], color: 'rose', note: '5단계: 슬래싱 잔액 차감' },
      { lines: [32, 35], color: 'sky', note: '6단계: 유효 잔액 업데이트' },
    ],
  },
  'process-justification': {
    path: 'beacon-chain/core/epoch/epoch_processing.go — ProcessJustificationAndFinalization()',
    lang: 'go',
    code: epochRaw,
    highlight: [46, 56],
    desc: 'ProcessJustificationAndFinalization — 2/3 투표로 체크포인트 전환',
    annotations: [
      { lines: [48, 49], color: 'sky', note: '이전/현재 에폭 타겟 투표 잔액 집계' },
      { lines: [51, 53], color: 'emerald', note: '2/3 슈퍼 매저리티 체크' },
    ],
  },
};
