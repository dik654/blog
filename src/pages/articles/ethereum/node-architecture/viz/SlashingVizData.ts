export const STEPS = [
  { label: '슬래싱이 존재하는 이유 — 담보 기반 정직성', body: '32 ETH 스테이크 몰수 위협으로 정직성을 강제하며, 의도적 이중 서명만 처벌 대상입니다.' },
  { label: 'Proposer Slashing: 슬롯 9,288,001에서 두 블록 서명', body: '슬롯 9,288,001에 헤더 0x3a8f…와 0x7b2c…에 동시에 서명한 제안자 #584,221을 처벌합니다.' },
  { label: '증거 전파: ProposerSlashing이 슬롯 9,288,002에 포함', body: '고발자에게 즉시 포상 1/512 = 0.0625 ETH 지급. 증거는 온체인 영구 기록됩니다.' },
  { label: '즉각 패널티: 1 ETH 삭감 + 36일 강제 감금 시작', body: '32 ETH × 1/32 = 1 ETH 즉시 삭감. 잔액 31 ETH로 감소. 8,192에폭(≈36일) 감금 시작.' },
  { label: 'Correlation Penalty: 공모 비율에 비례 최대 전액 몰수', body: '동시 슬래싱 100명 / 1,010,000명 = 0.01% → 추가 삭감 ≈0.003 ETH. 1/3 도달 시 32 ETH 전액 몰수.' },
];

// Layout constants
export const BLOCK_W = 90, BLOCK_H = 82;
export const BA_X = 85,  BA_Y = 68;   // Block A center
export const BB_X = 335, BB_Y = 68;   // Block B center

// BLS Key sits well below the blocks
export const KEY_X = 210, KEY_Y = 190;

// SIG origins: slightly left/right of key so they don't overlap each other
export const SIG_A_OX = KEY_X - 26, SIG_A_OY = KEY_Y;
export const SIG_B_OX = KEY_X + 26, SIG_B_OY = KEY_Y;

// SIG packets land in the lower section of each block (below the divider line)
export const SIG_A_DX = BA_X, SIG_A_DY = BA_Y + 22;
export const SIG_B_DX = BB_X, SIG_B_DY = BB_Y + 22;
