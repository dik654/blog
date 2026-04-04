import type { CodeRef } from '@/components/code/types';
import rangeModRs from './codebase/bulletproofs/src/range_proof/mod.rs?raw';
import dealerRs from './codebase/bulletproofs/src/range_proof/dealer.rs?raw';
import partyRs from './codebase/bulletproofs/src/range_proof/party.rs?raw';

export const rangeCodeRefs: Record<string, CodeRef> = {
  'range-proof-struct': {
    path: 'bulletproofs/src/range_proof/mod.rs',
    code: rangeModRs,
    lang: 'rust',
    highlight: [1, 60],
    annotations: [
      { lines: [1, 15], color: 'sky', note: '모듈 임포트 — curve25519-dalek, merlin, inner_product_proof' },
    ],
    desc: 'RangeProof 모듈의 진입점입니다. dealer, party, messages 하위 모듈을 통해 MPC 패턴으로 다중 범위 증명을 생성합니다.',
  },

  'dealer': {
    path: 'bulletproofs/src/range_proof/dealer.rs',
    code: dealerRs,
    lang: 'rust',
    highlight: [1, 60],
    annotations: [
      { lines: [1, 15], color: 'sky', note: '모듈 임포트 — generators, inner_product_proof, transcript' },
    ],
    desc: 'Dealer는 MPC 범위 증명의 조율자입니다. 각 Party에서 비트 커밋/다항식 커밋을 수집하고, 도전값(y, z, x)을 생성한 뒤 IPP로 최종 증명을 집계합니다.',
  },

  'party': {
    path: 'bulletproofs/src/range_proof/party.rs',
    code: partyRs,
    lang: 'rust',
    highlight: [1, 60],
    annotations: [
      { lines: [1, 15], color: 'sky', note: '모듈 임포트 — generators, transcript' },
    ],
    desc: 'Party는 MPC 범위 증명의 개별 참여자입니다. 비밀 값 v를 비트 분해하여 커밋을 생성하고, Dealer의 도전값에 대한 응답(proof share)을 계산합니다.',
  },
};
