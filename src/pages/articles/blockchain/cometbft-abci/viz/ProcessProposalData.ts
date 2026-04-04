export const C = {
  exec: '#6366f1',   // BlockExecutor
  proxy: '#f59e0b',  // AppConnConsensus
  local: '#0ea5e9',  // localClient
  app: '#10b981',    // Application
  reject: '#ef4444', // REJECT
};

export const STEPS = [
  {
    label: '① 검증자가 제안 블록 수신',
    body: '모든 검증자가 제안 블록의 Txs/Hash/Height를 앱에 전달하여 검증',
  },
  {
    label: '② proxy → localClient → app 호출',
    body: 'AppConnConsensus → localClient로 위임 → Lock → app.ProcessProposal → Unlock',
  },
  {
    label: '③ ACCEPT vs REJECT 분기',
    body: 'ACCEPT면 정상 prevote, REJECT면 nil prevote — 충분히 거부되면 다음 라운드',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'process-proposal',
  1: 'proxy-process',
  2: 'process-proposal',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'execution.go — ProcessProposal',
  1: 'app_conn_consensus.go → local_client.go',
  2: 'execution.go — ACCEPT/REJECT 분기',
};
