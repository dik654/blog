export const C = {
  sync: '#6366f1',
  miner: '#10b981',
  vrf: '#f59e0b',
  sig: '#8b5cf6',
  beacon: '#ec4899',
  post: '#ef4444',
};

export const STEPS = [
  { label: '높이 + 타임스탬프 검사' },
  { label: '6개 검증 병렬 실행' },
  { label: '마이너 자격 → VRF 당선' },
  { label: '서명 · 비콘 · 티켓' },
  { label: 'WinningPoSt 저장 증명' },
];

export const STEP_REFS: Record<number, string> = {
  0: 'ec-validate', 1: 'ec-async', 2: 'ec-winner',
  3: 'ec-async', 4: 'ec-async',
};
