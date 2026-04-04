export const STEPS = [
  { label: '32 ETH 예치 → Deposit Contract에 전송합니다' },
  { label: '6.8시간 대기 (ETH1_FOLLOW_DISTANCE = 2048 블록) — EL 재편성 방지' },
  { label: '활성화 큐 대기 (Churn Limit = max(8, count/65536) / 에폭)' },
  { label: 'Active — 매 에폭 어테스테이션 의무, 확률적 블록 제안' },
  { label: '자발적 탈퇴 — 256에폭(≈27시간) 감금 대기 후 완전 탈퇴' },
  { label: '슬래싱 — 이중 서명 적발 시 1/32 삭감 + 36일 강제 감금' },
];

export const ANNOT = [
  'Deposit Contract 0x00000…219ab에 32 ETH 전송',
  '2,048 EL 블록(≈6.8h) 대기 — reorg 방지',
  'churn limit = max(8, 1,010,000/65,536) = 15/epoch',
  'epoch마다 어테스테이션 의무 + 1/32 제안 확률',
  '256 epoch(≈27h) 감금 후 0x01 주소로 인출',
  '1/32(=1 ETH) 즉시 삭감 + 8,192 epoch(36일) 감금',
];

export const STATES = [
  { label: 'Deposited', sub: '32 ETH', cx: 50,  cy: 100, color: '#eab308' },
  { label: 'Pending',   sub: '6.8h',   cx: 140, cy: 100, color: '#3b82f6' },
  { label: 'Active',    sub: '의무',   cx: 230, cy: 100, color: '#22c55e' },
  { label: 'Exiting',   sub: '27h',    cx: 320, cy: 100, color: '#f97316' },
  { label: 'Withdrawn', sub: '완료',   cx: 400, cy: 100, color: '#94a3b8' },
  { label: 'Slashed',   sub: '36d',    cx: 230, cy: 185, color: '#ef4444' },
];

export const RAIL_Y = 46;

export const DOT_POS = STATES.map(s => ({ x: s.cx, y: RAIL_Y }));
DOT_POS[5] = { x: 230, y: 185 };
