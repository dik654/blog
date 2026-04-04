import type { CodeRef } from '@/components/code/types';
import typesRs from './codebase/commonware/simplex_types.rs?raw';

export const typesCodeRefs: Record<string, CodeRef> = {
  'proposal-type': {
    path: 'consensus/src/simplex/types.rs',
    code: typesRs, lang: 'rust', highlight: [4, 9],
    desc: 'Proposal — 제안 블록의 최소 표현.\nround(epoch+view), parent(부모 뷰), payload(블록 해시) 3개 필드.\n부모 뷰와 현재 뷰 사이에 gap이 있으면 그 사이 모든 뷰의 nullification이 필요.',
    annotations: [
      { lines: [4, 9], color: 'sky', note: 'Proposal 구조체 — round·parent·payload. payload는 Digest 제네릭 (SHA256 등)' },
    ],
  },
  'notarize-type': {
    path: 'consensus/src/simplex/types.rs',
    code: typesRs, lang: 'rust', highlight: [12, 16],
    desc: 'Notarize — 개별 검증자의 "이 제안에 찬성" 투표.\nproposal + attestation(서명). 서명 스킴이 Scheme 제네릭으로 추상화.',
    annotations: [
      { lines: [12, 16], color: 'emerald', note: 'Notarize = Proposal + Attestation(서명). scheme.sign()으로 생성' },
    ],
  },
  'notarization-type': {
    path: 'consensus/src/simplex/types.rs',
    code: typesRs, lang: 'rust', highlight: [19, 23],
    desc: 'Notarization — 2f+1 Notarize 투표를 모아 만든 집합 인증서.\nassemble::<_, N3f1>()로 쿼럼 검증 후 certificate 복원.\ned25519: 개별 서명 목록 / BLS: 96바이트 임계 서명.',
    annotations: [
      { lines: [19, 23], color: 'amber', note: 'Notarization = Proposal + Certificate. BLS에서는 96바이트 집합 서명' },
      { lines: [27, 31], color: 'violet', note: 'from_notarizes — scheme.assemble::<_, N3f1>()로 쿼럼 검증. N3f1 = 2f+1 명 필요' },
    ],
  },
  'vote-tracker': {
    path: 'consensus/src/simplex/types.rs',
    code: typesRs, lang: 'rust', highlight: [47, 53],
    desc: 'VoteTracker — 뷰별 투표 수집기.\nnotarize/nullify/finalize 각각 AttributableMap으로 관리.\n검증자당 1표만 허용 (signer 인덱스 키).',
    annotations: [
      { lines: [47, 53], color: 'sky', note: 'VoteTracker — 3종 투표를 AttributableMap으로 분리 추적. 검증자당 1표 제한' },
    ],
  },
};
