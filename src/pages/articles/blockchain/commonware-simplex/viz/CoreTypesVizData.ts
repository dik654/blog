export const STATE_STEPS = [
  {
    label: 'State — 에폭 단위 상태',
    body: 'view: 현재 합의 뷰 번호 — last_finalized: 마지막으로 확정된 뷰',
  },
  {
    label: 'Round — 뷰 단위 투표 상태',
    body: 'leader: 이 뷰의 리더 검증자 — proposal: ProposalSlot(None→Unverified→Verified)',
  },
  {
    label: 'enter_view() — 뷰 전환',
    body: '현재 view보다 높은 뷰로만 전환 (회귀 방지)',
  },
];

export const MSG_STEPS = [
  {
    label: 'Proposal — 블록 제안',
    body: 'round(epoch+view) + parent(부모 뷰) + payload(블록 해시)',
  },
  {
    label: '투표 타입: Notarize · Nullify · Finalize',
    body: 'Notarize — 제안 승인 투표 (proposal + attestation)',
  },
  {
    label: '인증서: 2f+1 투표 집합',
    body: 'Notarization — 2f+1 Notarize → 공증 완료',
  },
  {
    label: 'Trait 분리: Automaton · Relay · Reporter',
    body: 'Automaton — 상태 머신 (propose, verify, certify)',
  },
];

export const STATE_REFS = ['simplex-state', 'round-struct', 'enter-view'];
export const STATE_LABELS = ['State 구조체', 'Round 구조체', 'enter_view()'];
export const MSG_REFS = ['proposal-type', 'notarize-type', 'notarization-type', 'consensus-traits'];
export const MSG_LABELS = ['Proposal', 'Notarize/Nullify', 'Notarization + VoteTracker', 'Automaton·Relay·Reporter'];
