export const C = {
  validate: '#6366f1',
  finalize: '#10b981',
  save: '#f59e0b',
  update: '#8b5cf6',
  commit: '#ec4899',
  events: '#0ea5e9',
};

export const STEPS = [
  {
    label: '① validateBlock — 구조 검증',
    body: '헤더·LastCommit·Evidence·Proposer 4가지 검증',
  },
  {
    label: '② FinalizeBlock — ABCI 실행',
    body: 'proxyApp.FinalizeBlock(req)',
  },
  {
    label: '③ SaveFinalizeBlockResponse',
    body: 'store.SaveFinalizeBlockResponse(height, abciResponse)',
  },
  {
    label: '④ updateState + Commit',
    body: 'updateState: ValidatorUpdates + ConsensusParams 적용',
  },
  {
    label: '⑤ fireEvents — 이벤트 전파',
    body: 'fireEvents(eventBus, block, abciResponse)',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'validate-block', 1: 'apply-block',
  2: 'apply-block', 3: 'apply-block', 4: 'apply-block',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'validation.go — validateBlock()',
  1: 'execution.go — FinalizeBlock(ABCI)',
  2: 'execution.go — SaveFinalizeBlockResponse',
  3: 'execution.go — Commit + Save',
  4: 'execution.go — fireEvents',
};
