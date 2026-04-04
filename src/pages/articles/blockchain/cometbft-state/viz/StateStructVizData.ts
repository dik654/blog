export const C = { state: '#10b981', val: '#6366f1', params: '#f59e0b', app: '#8b5cf6' };

export const STEPS = [
  {
    label: 'State — 합의 엔진의 스냅샷',
    body: '마지막 확정 블록 기준의 모든 정보를 보관',
  },
  {
    label: 'Validators 3중 세트',
    body: 'LastValidators — 이전 블록 검증용',
  },
  {
    label: 'ConsensusParams & AppHash',
    body: 'ConsensusParams — 블록 크기, 증거 유효기간, 가스 등',
  },
  {
    label: 'store.Save(state) — DB 기록',
    body: 'applyBlock() 완료 후 store.Save() 호출',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'state-struct', 1: 'state-struct', 2: 'state-struct', 3: 'state-store',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'state.go — State struct 정의',
  1: 'state.go — Validators 3중 세트',
  2: 'state.go — ConsensusParams, AppHash',
  3: 'store.go — Store.Save()',
};
