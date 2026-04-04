export const C = {
  vrf: '#8b5cf6', win: '#10b981', fail: '#ef4444', block: '#f59e0b',
};

export const STEP_REFS: Record<number, string> = {
  0: 'winning-post', 1: 'winning-post', 2: 'winning-post',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'wdpost_run.go L22 — computeElectionProof()',
  1: 'wdpost_run.go L27 — WinCount 확인',
  2: 'wdpost_run.go L31 — GenerateWinningPoSt()',
};

export const STEPS = [
  {
    label: 'ElectionProof 생성 (VRF)',
    body: 'MineOne() 진입 → computeElectionProof(ctx, base)',
  },
  {
    label: 'WinCount 확인 — 당첨 여부',
    body: 'eproof.WinCount < 1 → return nil (추첨 탈락)',
  },
  {
    label: 'PoSt 증명 생성 → 블록 조립',
    body: 'GenerateWinningPoSt(ctx, minerAddr, challenges)',
  },
];
