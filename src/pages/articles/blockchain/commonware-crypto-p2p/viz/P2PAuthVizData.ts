export const C = {
  handshake: '#6366f1',
  sender: '#10b981',
  blocker: '#ef4444',
  relay: '#f59e0b',
};

export const STEPS = [
  {
    label: 'X25519 키 교환 → AES-GCM 암호화 채널',
    body: '임시 키 교환 → SharedSecret 도출 → HKDF로 ChaCha20-Poly1305 대칭키 생성',
  },
  {
    label: 'Sender trait 계층: 전송 제어 4단계',
    body: 'Unlimited → Limited → Checked → Sender 4단계 계층, blanket impl로 자동 조합',
  },
  {
    label: 'Recipients: 수신 범위 3가지',
    body: 'All / Some / One 세 가지 범위 — Channel(u64)로 단일 TCP 멀티플렉싱',
  },
  {
    label: 'block! 매크로: 악성 피어 즉시 격리',
    body: 'block! 매크로로 악성 피어 즉시 격리 — 연결 종료 + 재연결 거부',
  },
];

export const STEP_REFS = [
  'handshake-exchange',
  'p2p-sender',
  'p2p-recipients',
  'p2p-blocker',
];

export const STEP_LABELS = [
  'key_exchange.rs — X25519',
  'lib.rs — Sender 계층',
  'lib.rs — Recipients',
  'lib.rs — Blocker',
];
