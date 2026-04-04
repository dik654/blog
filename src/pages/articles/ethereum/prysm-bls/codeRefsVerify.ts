import type { CodeRef } from '@/components/code/types';
import sigRaw from './codebase/prysm/crypto/bls/blst/signature.go?raw';

export const verifyCodeRefs: Record<string, CodeRef> = {
  'bls-verify': {
    path: 'crypto/bls/blst/signature.go — Verify()',
    lang: 'go',
    code: sigRaw,
    highlight: [3, 14],
    desc: 'Verify — 단일 BLS 서명 검증 (패어링 연산)',
    annotations: [
      { lines: [6, 12], color: 'sky', note: 'blst.Verify: e(sig,G2)==e(H(msg),pk) 패어링' },
      { lines: [8, 8], color: 'emerald', note: 'P1Affine: G1 위의 공개키' },
    ],
  },
  'bls-fast-agg-verify': {
    path: 'crypto/bls/blst/signature.go — FastAggregateVerify()',
    lang: 'go',
    code: sigRaw,
    highlight: [29, 39],
    desc: 'FastAggregateVerify — 동일 메시지, 다수 서명자 최적화 검증',
    annotations: [
      { lines: [30, 31], color: 'sky', note: '동일 메시지 → pk 먼저 집계 → 패어링 1회' },
      { lines: [36, 36], color: 'amber', note: 'FastAggregateVerify: O(n) 덧셈 + O(1) 패어링' },
    ],
  },
  'bls-batch': {
    path: 'crypto/bls/blst/signature.go — AggregateVerify()',
    lang: 'go',
    code: sigRaw,
    highlight: [16, 27],
    desc: 'AggregateVerify — 서로 다른 메시지에 대한 집계 서명 검증',
    annotations: [
      { lines: [18, 19], color: 'sky', note: '각 (pk, msg) 쌍이 모두 다를 수 있음' },
      { lines: [24, 24], color: 'emerald', note: 'n개 패어링 연산 필요 (배치 최적화)' },
    ],
  },
};
