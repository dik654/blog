import type { CodeRef } from '@/components/code/types';
import proposeRs from './codebase/commonware/simplex_propose.rs?raw';
import notarizeRs from './codebase/commonware/simplex_notarize.rs?raw';
import nullifyRs from './codebase/commonware/simplex_nullify.rs?raw';
import finalizeRs from './codebase/commonware/simplex_finalize.rs?raw';

export const votingCodeRefs: Record<string, CodeRef> = {
  'try-propose': {
    path: 'consensus/src/simplex/actors/voter/state.rs',
    code: proposeRs, lang: 'rust', highlight: [4, 31],
    desc: 'try_propose() — 리더가 블록 제안을 시도.\ngenesis뷰 제외 → should_propose(리더 확인) → find_parent(부모 인증서) → Context 반환.\n부모 뷰와 현재 뷰 사이 gap이 있으면 nullification 증명이 필요.',
    annotations: [
      { lines: [5, 7], color: 'sky', note: 'genesis뷰 제외 — 뷰 0은 제안 불가 (genesis 블록이 차지)' },
      { lines: [8, 14], color: 'emerald', note: 'should_propose — 리더인지, 이미 building 중인지 확인' },
      { lines: [17, 24], color: 'amber', note: 'find_parent — 이전 certified 뷰 탐색. 부모 미확보 시 제안 불가' },
      { lines: [25, 31], color: 'violet', note: 'Context 구성 — round(epoch+view), leader, parent(view+payload) 반환' },
    ],
  },
  'construct-notarize': {
    path: 'consensus/src/simplex/actors/voter/state.rs',
    code: notarizeRs, lang: 'rust', highlight: [4, 11],
    desc: 'construct_notarize() — 제안 검증 후 서명 투표 생성.\nRound에서 construct_notarize()로 후보 Proposal 획득 → Notarize::sign()으로 서명.',
    annotations: [
      { lines: [4, 7], color: 'sky', note: 'round.construct_notarize() — 투표 가능 상태인지 확인 후 Proposal 반환' },
      { lines: [10, 11], color: 'emerald', note: 'Notarize::sign() — scheme.sign(Subject::Notarize{proposal})으로 서명 생성' },
    ],
  },
  'broadcast-notarization': {
    path: 'consensus/src/simplex/actors/voter/actor.rs',
    code: notarizeRs, lang: 'rust', highlight: [32, 44],
    desc: 'try_broadcast_notarization() — 2f+1 투표 수집 완료 시 인증서 조립·브로드캐스트.\nstate.broadcast_notarization()이 None이 아니면 쿼럼 달성 → resolver·handler·journal·broadcast 순서.',
    annotations: [
      { lines: [32, 33], color: 'sky', note: 'broadcast_notarization() — Round가 쿼럼 달성 여부 확인 후 Notarization 반환' },
      { lines: [35, 37], color: 'emerald', note: 'resolver.updated — resolver에게 뷰 완료 알림 (추가 요청 중단)' },
      { lines: [38, 41], color: 'amber', note: 'handle + sync + broadcast — 저장, fsync, 전체 브로드캐스트 순서' },
    ],
  },
  'construct-nullify': {
    path: 'consensus/src/simplex/actors/voter/state.rs',
    code: nullifyRs, lang: 'rust', highlight: [4, 22],
    desc: 'construct_nullify() — 타임아웃 시 null 투표 생성.\n현재 뷰만 대상 → Round.construct_nullify()(finalize 여부 확인) → Nullify::sign().\ntimeout 원인을 LeaderTimeout vs CertificationTimeout으로 구분해 메트릭 기록.',
    annotations: [
      { lines: [5, 7], color: 'sky', note: '현재 뷰만 nullify 가능 — 과거 뷰는 이미 인증서가 존재하거나 무관' },
      { lines: [9, 10], color: 'emerald', note: 'Round.construct_nullify() — broadcast_finalize면 None (이미 확정 진행 중)' },
      { lines: [12, 21], color: 'amber', note: '타임아웃 원인 분류: 제안 유무로 LeaderTimeout vs CertificationTimeout 구분' },
    ],
  },
  'broadcast-nullification': {
    path: 'consensus/src/simplex/actors/voter/state.rs',
    code: nullifyRs, lang: 'rust', highlight: [25, 29],
    desc: 'broadcast_nullification() — 2f+1 Nullify 수집 완료 시 Nullification 인증서 반환.\nRound의 broadcast_nullification 플래그로 중복 방지.',
    annotations: [
      { lines: [25, 29], color: 'sky', note: 'Round.broadcast_nullification() — 이미 브로드캐스트했으면 None 반환' },
    ],
  },
  'add-finalization': {
    path: 'consensus/src/simplex/actors/voter/state.rs',
    code: finalizeRs, lang: 'rust', highlight: [4, 25],
    desc: 'add_finalization() — Finalization 인증서 수신 시 처리.\nlast_finalized 갱신 → 이하 뷰의 인증 후보/미완료 인증 정리 → enter_view(next) → set_leader.\n즉시 다음 뷰 진입이 Simplex의 핵심 혁신.',
    annotations: [
      { lines: [8, 9], color: 'sky', note: 'last_finalized 갱신 — 이 뷰 이하는 더 이상 추적 불필요' },
      { lines: [12, 17], color: 'emerald', note: '정리: certification_candidates 가지치기 + outstanding_certifications abort' },
      { lines: [20, 22], color: 'amber', note: 'enter_view + set_leader — 즉시 다음 뷰! Simplex Change #1' },
    ],
  },
  'certified': {
    path: 'consensus/src/simplex/actors/voter/state.rs',
    code: finalizeRs, lang: 'rust', highlight: [28, 46],
    desc: 'certified() — 앱의 인증(certify) 결과 처리.\n성공 → 타이머 해제 + enter_view(next). 실패 → trigger_timeout(FailedCertification).\nnotarization을 반환하여 caller가 브로드캐스트.',
    annotations: [
      { lines: [30, 33], color: 'sky', note: 'round.certified(success) — CertifyState::Certified(bool)로 전환' },
      { lines: [38, 39], color: 'emerald', note: '성공: enter_view(next) — 다음 뷰로 전진. finalize 투표 가능 상태' },
      { lines: [40, 41], color: 'amber', note: '실패: trigger_timeout — FailedCertification으로 nullify 경로 진입' },
    ],
  },
};
