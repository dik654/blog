import type { CodeRef } from '@/components/code/types';
import pdpGo from './codebase/curio/pdp.go?raw';

export const codeRefs: Record<string, CodeRef> = {
  'pdp-main': {
    path: 'pdp/pdp.go',
    code: pdpGo, lang: 'go', highlight: [5, 55],
    desc: 'pdp.go — PDP 챌린지 스케줄링, SHA256 증명 생성, 온체인 검증',
    annotations: [
      { lines: [5, 10], color: 'sky',
        note: 'PDPVerifier — 증명 세트와 챌린지 스케줄을 관리하는 온체인 Actor' },
      { lines: [14, 20], color: 'emerald',
        note: 'ScheduleChallenge — DRAND 랜덤으로 챌린지 시점 결정 (예측 불가)' },
      { lines: [28, 37], color: 'amber',
        note: 'GenerateProof — 랜덤 오프셋에서 160바이트 읽고 SHA256 해시' },
      { lines: [49, 53], color: 'violet',
        note: 'VerifyOnChain — SHA256 재계산 + 머클 루트 대조로 검증' },
    ],
  },
};
