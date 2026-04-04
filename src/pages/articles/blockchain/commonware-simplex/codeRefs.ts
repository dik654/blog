export type { CodeRef, LineNote } from '@/components/code/types';
import type { CodeRef } from '@/components/code/types';
import { stateCodeRefs } from './codeRefsState';
import { typesCodeRefs } from './codeRefsTypes';
import { engineCodeRefs } from './codeRefsEngine';
import { votingCodeRefs } from './codeRefsVoting';
import { electorCodeRefs } from './codeRefsElector';
import traitsRs from './codebase/commonware/consensus_traits.rs?raw';
import thresholdRs from './codebase/commonware/simplex_threshold.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  ...stateCodeRefs,
  ...typesCodeRefs,
  ...engineCodeRefs,
  ...votingCodeRefs,
  ...electorCodeRefs,
  'consensus-traits': {
    path: 'consensus/src/lib.rs', code: traitsRs, lang: 'rust',
    highlight: [27, 43],
    desc: 'Automaton trait — 합의 엔진이 호출하는 애플리케이션 인터페이스.\ngenesis/propose/verify/certify를 외부에 위임.',
    annotations: [
      { lines: [4, 7], color: 'sky', note: 'Heightable/Viewable — 블록 높이·뷰 번호 추상화' },
      { lines: [10, 14], color: 'emerald', note: 'Block trait — digest(해시)·parent(부모) 체인 연결' },
      { lines: [27, 43], color: 'amber', note: 'Automaton — propose/verify/certify를 oneshot 비동기로 위임' },
      { lines: [46, 51], color: 'violet', note: 'Relay — broadcast(전체)/send(특정 피어) 네트워크 추상화' },
    ],
  },
  'threshold-dkg': {
    path: 'consensus/threshold_simplex', code: thresholdRs, lang: 'rust',
    highlight: [20, 49],
    desc: 'DKG(분산 키 생성) — 3단계로 그룹 공개키 도출.\n공유 생성 → P2P 전송 → 수신/검증 → 공개키 합의.',
    annotations: [
      { lines: [20, 28], color: 'sky', note: 'Phase 1: 비밀 공유 생성 후 P2P 암호화 전송' },
      { lines: [36, 38], color: 'emerald', note: 'Phase 2: 수신 공유 검증. 비잔틴 탐지' },
      { lines: [41, 45], color: 'amber', note: 'Phase 3: 그룹 공개키 도출 → Signer 생성' },
      { lines: [49, 53], color: 'violet', note: 'combine — t개 부분 서명 → 96B 임계 서명' },
    ],
  },
};
