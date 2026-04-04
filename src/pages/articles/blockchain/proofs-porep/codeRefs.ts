import type { CodeRef } from '@/components/code/types';
import sealRs from './codebase/rust-fil-proofs/seal.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'seal-porep': {
    path: 'filecoin-proofs/src/api/seal.rs',
    code: sealRs, lang: 'rust', highlight: [4, 66],
    desc: 'seal.rs — PC1(SDR 레이블링) → PC2(칼럼 해시) → C2(Groth16 증명) 봉인 파이프라인',
    annotations: [
      { lines: [4, 13], color: 'sky',
        note: 'PC1 시그니처 — 원본 데이터 + 랜덤 ticket으로 봉인 시작' },
      { lines: [22, 29], color: 'emerald',
        note: 'SDR 11층 레이블링 — SHA256 순차 계산, ~4억 노드/레이어' },
      { lines: [39, 43], color: 'amber',
        note: 'PC2 Poseidon 칼럼 해시 — GPU 가속 가능' },
      { lines: [56, 61], color: 'violet',
        note: 'C2 Groth16 증명 — GPU MSM 가속' },
    ],
  },
};
