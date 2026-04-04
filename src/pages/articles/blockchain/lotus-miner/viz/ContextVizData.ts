export const C = {
  sector: '#6366f1', seal: '#f59e0b',
  prove: '#10b981', err: '#ef4444', win: '#8b5cf6',
};

export const STEP_REFS: Record<number, string> = {
  0: 'sector-states', 1: 'sector-states',
  2: 'winning-post', 3: 'winning-post',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'states.go — SectorState 타입',
  1: 'states.go L27 — handlePreCommit1()',
  2: 'wdpost_run.go L18 — MineOne()',
  3: 'wdpost_run.go — WindowPoSt deadline',
};

export const STEPS = [
  {
    label: '마이너의 두 가지 역할',
    body: '1. 섹터 봉인 — 데이터 저장 + 증명 (go-statemachine)',
  },
  {
    label: '섹터 봉인: 8단계 상태 머신',
    body: 'Empty → Packing(데이터 채우기) → PreCommit1(SDR, CPU 3-5h)',
  },
  {
    label: 'WinningPoSt: VRF 추첨 → 블록 생성',
    body: '매 에폭(30초)마다 MineOne() 호출',
  },
  {
    label: 'WindowPoSt: 24시간 존재 증명',
    body: '48개 deadline으로 섹터 분할, 각 deadline에서 PoSt 제출',
  },
];
