export const C = {
  block: '#6366f1',
  weight: '#f59e0b',
  f3: '#10b981',
  ec: '#ef4444',
};

export const STEPS = [
  {
    label: 'Tipset = 같은 에폭 + 같은 부모의 블록 집합',
    body: '이더리움: 슬롯당 1블록 / Filecoin: 에폭당 평균 5블록(Poisson 복수 당선) → 처리량 향상+포크 흡수',
  },
  {
    label: 'Tipset 유효성 조건',
    body: '같은 에폭+같은 부모+고유 마이너 — WinCount 3이어도 블록은 1개만 생성',
  },
  {
    label: 'Heaviest Chain Rule — 포크 선택',
    body: '가중치(부모w + log₂P + WinCount 보너스) 가장 큰 체인 선택 — LMD-GHOST와 유사한 원리',
  },
  {
    label: 'EC vs F3 — 확정성 비교',
    body: 'EC: 900에폭(~7.5h) 확률적 확정 / F3: GossiPBFT 수분 내 결정론적 확정 → 역할 분리',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'ec-weight', 1: 'ec-validate', 2: 'ec-weight', 3: 'ec-weight',
};
