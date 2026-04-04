export const C = {
  dealer: '#6366f1',
  player: '#10b981',
  output: '#f59e0b',
};

export const STEPS = [
  {
    label: 'Step 1: Dealer.start() — 다항식 + 공유 생성',
    body: 'degree 2f 비밀 다항식 생성 → 공개 커밋먼트 브로드캐스트 + 개인 share P2P 전달',
  },
  {
    label: 'Step 3: Player.dealer_message() — 검증 + ACK',
    body: '커밋먼트 vs share 일치 검증 — 유효하면 ACK 서명, 실패 시 암묵적 complaint',
  },
  {
    label: 'Step 4: Dealer.finalize() — ACK 미수신 share 공개',
    body: 'ACK 미수신 시 해당 share를 reveal — 정직 딜러는 최대 f개 reveal',
  },
  {
    label: 'Step 5: Player.finalize() — Share + Output 계산',
    body: '유효 딜러의 share 합산 → 개인 share + 그룹 공개키(96B) Output 도출',
  },
];

export const STEP_REFS = [
  'dkg-dealer',
  'dkg-player',
  'dkg-dealer',
  'dkg-player',
];

export const STEP_LABELS = [
  'dkg.rs — Dealer::start()',
  'dkg.rs — Player::dealer_message()',
  'dkg.rs — Dealer::finalize()',
  'dkg.rs — Player::finalize()',
];
