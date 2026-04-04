import type { CodeRef } from '@/components/code/types';
import postRs from './codebase/rust-fil-proofs/post.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'post-main': {
    path: 'filecoin-proofs/src/api/post.rs',
    code: postRs, lang: 'rust', highlight: [4, 49],
    desc: 'post.rs — WindowPoSt(정기 검증)와 WinningPoSt(블록 보상) 증명 생성',
    annotations: [
      { lines: [5, 9], color: 'sky',
        note: 'WindowPoSt 시그니처 — randomness로 챌린지 위치 결정' },
      { lines: [13, 16], color: 'emerald',
        note: '챌린지 생성 — 파티션 내 섹터 × 챌린지 수만큼 랜덤 선택' },
      { lines: [19, 22], color: 'amber',
        note: '머클 경로 생성 — TreeR에서 리프까지 siblings 추출' },
      { lines: [33, 36], color: 'violet',
        note: 'WinningPoSt — 1개 섹터 소수 리프, 빠른 증명 (30초 이내)' },
    ],
  },
};
