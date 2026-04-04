export const C = {
  parent: '#6366f1',
  log2: '#10b981',
  bonus: '#f59e0b',
  total: '#8b5cf6',
};

export const STEPS = [
  {
    label: '부모 가중치 상속',
    body: 'ts.ParentWeight()에서 시작 — 긴 체인일수록 기본 가중치가 높음',
  },
  {
    label: 'log₂(totalPower) × 2⁸ 항',
    body: 'log₂P = tpow.BitLen()-1 정수 로그 → 256배 스케일링으로 고정소수점 정밀도 유지',
  },
  {
    label: 'WinCount 보너스',
    body: '블록이 많은 Tipset이 더 무거운 체인 → 빈 에폭(null round) 불리하게 만들어 참여 장려',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'ec-weight', 1: 'ec-weight', 2: 'ec-weight',
};
