import type { CodeRef } from '@/components/code/types';

import bootstrapRs from './codebase/helios/consensus/src/bootstrap.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'hl-fetch': {
    path: 'helios/consensus/src/bootstrap.rs',
    code: bootstrapRs,
    lang: 'rust',
    highlight: [5, 18],
    desc: 'fetch_bootstrap — 체크포인트 URL로 Bootstrap 데이터 가져오기.',
    annotations: [
      { lines: [5, 8], color: 'sky', note: '체크포인트 해시 + RPC URL 인자' },
      { lines: [9, 13], color: 'emerald', note: 'Beacon API URL 조합' },
      { lines: [14, 17], color: 'amber', note: 'HTTP GET → JSON 역직렬화' },
    ],
  },
  'hl-init': {
    path: 'helios/consensus/src/bootstrap.rs',
    code: bootstrapRs,
    lang: 'rust',
    highlight: [22, 43],
    desc: 'init_store — Merkle 브랜치 검증 후 LightClientStore 초기화.',
    annotations: [
      { lines: [27, 33], color: 'sky', note: 'is_valid_merkle_branch — depth=5, index=22' },
      { lines: [34, 36], color: 'rose', note: '브랜치 무효 시 에러 반환' },
      { lines: [37, 43], color: 'emerald', note: 'Store 필드 초기화 (finalized + committee)' },
    ],
  },
};
