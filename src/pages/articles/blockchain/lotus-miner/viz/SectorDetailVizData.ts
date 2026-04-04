export const C = {
  sector: '#6366f1', seal: '#f59e0b', prove: '#10b981', err: '#ef4444',
};

export const STEP_REFS: Record<number, string> = {
  0: 'sector-states', 1: 'sector-states',
  2: 'sector-states', 3: 'winning-post',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'states.go L27 — handlePreCommit1()',
  1: 'states.go L18 — PreCommit2 + WaitSeed',
  2: 'states.go L20 — Committing + Proving',
  3: 'wdpost_run.go — WindowPoSt deadline 처리',
};

export const STEPS = [
  {
    label: 'Packing → PreCommit1 (SDR)',
    body: 'Packing: Piece 데이터를 섹터에 채움',
  },
  {
    label: 'PreCommit2 → WaitSeed',
    body: 'PreCommit2: Merkle Tree 구축 (GPU 가속)',
  },
  {
    label: 'Commit → Proving 활성화',
    body: 'Committing: Groth16 zk-SNARK 증명 생성 (GPU)',
  },
  {
    label: 'WindowPoSt: 24시간 주기 증명',
    body: '48개 deadline으로 분할 — 30분마다 하나씩 돌아감',
  },
];
