import type { CodeRef } from '@/components/code/types';

import libRs from './codebase/commonware/lib_rs.rs?raw';

export const overviewRefs: Record<string, CodeRef> = {
  'persistable-trait': {
    path: 'storage/src/lib.rs',
    code: libRs,
    lang: 'rust',
    highlight: [30, 49],
    desc: 'Persistable trait — commit(페이지 캐시), sync(fsync), destroy(해제). 모든 저장소 프리미티브의 공통 인터페이스.',
    annotations: [
      { lines: [24, 27], color: 'sky', note: 'Context — Storage + Clock + Metrics 번들' },
      { lines: [30, 31], color: 'emerald', note: 'Persistable trait 정의' },
      { lines: [35, 38], color: 'amber', note: 'commit — 기본 구현은 sync 위임' },
      { lines: [41, 42], color: 'violet', note: 'sync — fsync로 SSD까지 내구성 보장' },
      { lines: [45, 46], color: 'rose', note: 'destroy — 파일 삭제 + 자원 해제' },
    ],
  },
  'context-trait': {
    path: 'storage/src/lib.rs',
    code: libRs,
    lang: 'rust',
    highlight: [24, 28],
    desc: 'Context = Storage + Clock + Metrics. 결정론적 시뮬레이션 시 Clock을 가짜 시계로 교체 가능.',
    annotations: [
      { lines: [24, 25], color: 'sky', note: 'Context trait bound — 3개 trait의 합' },
      { lines: [27, 28], color: 'emerald', note: 'blanket impl — 조건 만족 시 자동 구현' },
    ],
  },
};
