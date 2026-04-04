export const C = { drand: '#6366f1', fc: '#10b981', vrf: '#f59e0b', sector: '#8b5cf6' };

export const STEPS = [
  {
    label: 'WinningPoSt: DRAND로 검증 섹터 선택',
    body: 'DRAND 라운드의 랜덤 출력으로 — 검증할 섹터를 무작위 선정',
  },
  {
    label: '블록 생산 추첨 (Election)',
    body: 'DRAND 출력을 VRF 시드로 사용',
  },
  {
    label: 'Tipset 타임스탬프 동기화',
    body: 'Filecoin 에폭 = DRAND 라운드와 1:1 대응',
  },
];
