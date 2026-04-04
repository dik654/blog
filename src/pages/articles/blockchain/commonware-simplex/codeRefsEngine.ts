import type { CodeRef } from '@/components/code/types';
import engineRs from './codebase/commonware/simplex_engine.rs?raw';
import loopRs from './codebase/commonware/simplex_engine_loop.rs?raw';

export const engineCodeRefs: Record<string, CodeRef> = {
  'engine-struct': {
    path: 'consensus/src/simplex/engine.rs',
    code: engineRs, lang: 'rust', highlight: [3, 15],
    desc: 'Engine — 3-actor 아키텍처의 조립 구조체.\nVoter(합의 로직) + Batcher(투표 수집·서명 배치 검증) + Resolver(인증서 요청·응답).\n각 actor가 독립 task로 실행되며 mailbox로 통신.',
    annotations: [
      { lines: [3, 15], color: 'sky', note: 'Engine 필드: context + voter/batcher/resolver 쌍 (actor + mailbox)' },
      { lines: [27, 43], color: 'emerald', note: 'run() — 3 actor를 start()한 뒤 select!로 shutdown 대기. 어느 하나가 종료되면 panic' },
    ],
  },
  'engine-run': {
    path: 'consensus/src/simplex/actors/voter/actor.rs',
    code: loopRs, lang: 'rust', highlight: [4, 17],
    desc: 'Voter actor의 select_loop! — 메인 이벤트 루프.\non_start에서 propose/verify/certify 시도 → 5종 이벤트 대기 → on_end에서 notify + prune.',
    annotations: [
      { lines: [4, 17], color: 'sky', note: 'on_start: pending 정리 → try_propose → try_verify → certify_candidates 처리' },
      { lines: [27, 29], color: 'emerald', note: 'timeout: sleep_until(deadline) → nullify 브로드캐스트' },
      { lines: [31, 36], color: 'amber', note: 'propose_wait: 앱이 블록 생성 완료 → Proposal 구성 + relay.broadcast' },
      { lines: [46, 50], color: 'violet', note: 'certify_wait: 앱이 인증 완료 → certified(view, success) → 다음 뷰 or nullify' },
      { lines: [56, 63], color: 'rose', note: 'on_end: notify(투표/인증서 브로드캐스트) + prune + batcher.update' },
    ],
  },
};
