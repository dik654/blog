import type { CodeRef } from '@/components/code/types';
import signRaw from './codebase/prysm/crypto/bls/blst/secret_key.go?raw';

export const signCodeRefs: Record<string, CodeRef> = {
  'bls-sign': {
    path: 'crypto/bls/blst/secret_key.go — Sign()',
    lang: 'go',
    code: signRaw,
    highlight: [3, 13],
    desc: 'Sign — BLST C 라이브러리를 CGo로 호출하여 BLS 서명 생성',
    annotations: [
      { lines: [6, 6], color: 'sky', note: 'DST: BLS 스펙에서 정의한 도메인 분리 태그' },
      { lines: [7, 11], color: 'emerald', note: 'blst.Sign: Go → C → x86 어셈블리 체인' },
      { lines: [8, 8], color: 'amber', note: 'SecretKey: 32바이트 스칼라 (BLS12-381 Fr)' },
    ],
  },
};
