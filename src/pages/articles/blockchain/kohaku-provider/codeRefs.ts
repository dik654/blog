import type { CodeRef } from '@/components/code/types';

import providerRs from './codebase/kohaku/src/provider.rs?raw';
import oramRs from './codebase/kohaku/src/oram.rs?raw';
import dandelionRs from './codebase/kohaku/src/dandelion.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'kh-provider': {
    path: 'kohaku/src/provider.rs',
    code: providerRs,
    lang: 'rust',
    highlight: [5, 9],
    desc: 'Provider trait — get_balance, get_nonce, call 3개 메서드로 추상화. 구현체 교체로 MockProvider 주입 가능.',
    annotations: [
      { lines: [5, 9], color: 'sky', note: 'Provider trait — 3개 async 메서드' },
      { lines: [12, 17], color: 'emerald', note: 'KohakuProvider — Helios + ORAM + Dandelion 조합' },
      { lines: [20, 30], color: 'amber', note: 'get_balance — ORAM 쿼리 → Merkle 증명 검증' },
    ],
  },

  'kh-oram': {
    path: 'kohaku/src/oram.rs',
    code: oramRs,
    lang: 'rust',
    highlight: [14, 27],
    desc: 'ORAMProxy — 실제 쿼리 1개 + 더미 K개를 배치 전송. 서버가 진짜 쿼리를 식별할 확률 = 1/(K+1).',
    annotations: [
      { lines: [5, 8], color: 'sky', note: 'ORAMProxy 구조체 — k=7 더미 쿼리' },
      { lines: [14, 20], color: 'emerald', note: '더미 생성 + shuffle — 무작위 순서' },
      { lines: [22, 27], color: 'amber', note: '응답에서 진짜 결과만 추출' },
    ],
  },

  'kh-dandelion': {
    path: 'kohaku/src/dandelion.rs',
    code: dandelionRs,
    lang: 'rust',
    highlight: [12, 19],
    desc: 'DandelionRouter — Stem phase에서 단일 피어 전달, hop 초과 시 Fluff로 전체 가십. 발신자 익명화.',
    annotations: [
      { lines: [12, 19], color: 'sky', note: 'send_stem — 에폭 기반 고정 피어 선택' },
      { lines: [22, 27], color: 'emerald', note: 'relay — hop 카운트 확인' },
      { lines: [28, 31], color: 'amber', note: 'Fluff: 모든 피어에 가십 — 발신 노드 특정 불가' },
    ],
  },
};
