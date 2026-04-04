export const C = {
  exec: '#6366f1',   // BlockExecutor
  proxy: '#f59e0b',  // AppConnConsensus
  local: '#0ea5e9',  // localClient
  app: '#10b981',    // Application (Cosmos SDK)
};

export const STEPS = [
  {
    label: '① mempool에서 TX 수집',
    body: 'mempool.ReapMaxBytesMaxGas로 블록 크기 제한 내 TX 수집',
  },
  {
    label: '② appConn.PrepareProposal 호출',
    body: '프록시를 통해 앱에 TX 재정렬/필터링/추가를 위임',
  },
  {
    label: '③ localClient → app 직접 호출',
    body: 'localClient.PrepareProposal: Lock → app.PrepareProposal → Unlock\nMutex로 동시 접근 방지, 직렬화 없이 함수 직접 호출',
  },
  {
    label: '④ TxRecords로 블록 TX 교체',
    body: 'app이 TxRecords 반환 — 앱이 최종 TX 결정권 보유 (MEV 보호, 순서 변경)',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'create-proposal-block',
  1: 'proxy-prepare',
  2: 'local-prepare',
  3: 'create-proposal-block',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'execution.go — CreateProposalBlock',
  1: 'app_conn_consensus.go — PrepareProposal',
  2: 'local_client.go — PrepareProposal',
  3: 'execution.go — TxRecords 교체',
};
