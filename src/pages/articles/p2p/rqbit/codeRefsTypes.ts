import type { CodeRef } from '@/components/code/types';

import hashIdRs from './codebase/rqbit/crates/librqbit_core/src/hash_id.rs?raw';
import lengthsRs from './codebase/rqbit/crates/librqbit_core/src/lengths.rs?raw';

export const typeRefs: Record<string, CodeRef> = {
  'id20': {
    path: 'librqbit_core/src/hash_id.rs',
    code: hashIdRs,
    lang: 'rust',
    highlight: [7, 61],
    desc: 'Id<N>은 N바이트 고정 길이 해시입니다. Id20(SHA-1)은 info_hash·peer_id·DHT node_id에 사용됩니다.',
    annotations: [
      { lines: [7, 8], color: 'sky', note: 'Id<N> — const generic으로 20/32바이트 해시를 하나의 타입으로 통합' },
      { lines: [28, 40], color: 'emerald', note: 'distance — XOR 거리 (DHT 라우팅 테이블의 핵심 연산)' },
      { lines: [41, 55], color: 'amber', note: 'get_bit / set_bit — 비트 단위 조작 (버킷 트리 분할에 사용)' },
    ],
  },

  'lengths': {
    path: 'librqbit_core/src/lengths.rs',
    code: lengthsRs,
    lang: 'rust',
    highlight: [36, 49],
    desc: 'Lengths는 피스/청크 크기 계산을 담당합니다. 마지막 피스가 잘릴 수 있어 별도 필드로 관리합니다.',
    annotations: [
      { lines: [38, 38], color: 'sky', note: 'total_length — 토렌트 전체 바이트 수' },
      { lines: [41, 41], color: 'emerald', note: 'piece_length — 각 피스의 표준 크기 (마지막 피스 제외)' },
      { lines: [44, 45], color: 'amber', note: 'last_piece — 마지막 피스는 잘려있을 수 있으므로 별도 추적' },
      { lines: [48, 48], color: 'violet', note: 'chunks_per_piece — 하나의 피스를 16KiB 청크로 나눈 수' },
    ],
  },
};
