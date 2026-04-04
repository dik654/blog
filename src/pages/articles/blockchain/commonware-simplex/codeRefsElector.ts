import type { CodeRef } from '@/components/code/types';
import electorRs from './codebase/commonware/simplex_elector.rs?raw';

export const electorCodeRefs: Record<string, CodeRef> = {
  'elector-trait': {
    path: 'consensus/src/simplex/elector.rs',
    code: electorRs, lang: 'rust', highlight: [5, 16],
    desc: 'Elector trait — Config(설정) + Elector(실행) 타입 스테이트 패턴.\nConfig::build(participants)로 Elector 생성 — 합의 내부에서만 호출 가능.\n결정적 필수: 동일 입력 → 동일 리더 (모든 정직 참여자가 동의해야 함).',
    annotations: [
      { lines: [5, 8], color: 'sky', note: 'Config trait — build()로 초기화. 합의가 올바른 participant set으로 호출' },
      { lines: [11, 16], color: 'emerald', note: 'Elector trait — elect(round, certificate) → Leader. cert는 view 1에서만 None' },
    ],
  },
  'round-robin': {
    path: 'consensus/src/simplex/elector.rs',
    code: electorRs, lang: 'rust', highlight: [19, 27],
    desc: 'RoundRobinElector — view mod n_participants 단순 순환.\ncertificate 무시 — 입력이 round뿐이므로 완전 결정적.\nOptional seed shuffle로 초기 순서 랜덤화 가능.',
    annotations: [
      { lines: [24, 27], color: 'sky', note: 'modulo(view, len) — 뷰 번호로 리더 인덱스 결정. O(1) 연산' },
    ],
  },
  'random-elector': {
    path: 'consensus/src/simplex/elector.rs',
    code: electorRs, lang: 'rust', highlight: [34, 55],
    desc: 'RandomElector — BLS threshold VRF 서명에서 랜덤 시드 도출.\nView 1은 certificate 없음 → round-robin fallback.\n이후 뷰: SHA256(certificate) → mod participants로 편향 없는 선출.',
    annotations: [
      { lines: [40, 44], color: 'sky', note: 'View 1 fallback — 첫 뷰는 인증서 없으므로 round-robin으로 대체' },
      { lines: [46, 51], color: 'emerald', note: 'VRF 리더 선출 — SHA256(cert) → modulo. 임계값 미만 참여자가 결과 조작 불가' },
    ],
  },
};
