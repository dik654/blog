export const C = {
  exec: '#6366f1',   // BlockExecutor
  proxy: '#f59e0b',  // AppConnConsensus
  local: '#0ea5e9',  // localClient
  app: '#10b981',    // Application
  mem: '#8b5cf6',    // mempool
};

export const STEPS = [
  {
    label: '① mempool Lock → 새 TX 유입 차단',
    body: 'mempool.Lock()으로 블록 실행 중 새 TX 유입 차단 — defer Unlock()으로 해제',
  },
  {
    label: '② appConn.FinalizeBlock 호출',
    body: 'ABCI v2에서 BeginBlock+DeliverTx+EndBlock을 FinalizeBlock 하나로 통합',
  },
  {
    label: '③ 앱 응답: TxResults + ValidatorUpdates',
    body: 'TxResults(실행 결과) + ValidatorUpdates + AppHash(머클 루트) 반환',
  },
  {
    label: '④ updateState — 합의 상태 갱신',
    body: 'updateState로 검증자 셋과 합의 파라미터 갱신 — 다음 블록부터 적용',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'apply-block', 1: 'proxy-finalize', 2: 'local-finalize', 3: 'apply-block',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'execution.go — mempool.Lock()',
  1: 'app_conn_consensus.go → local_client.go',
  2: 'local_client.go — app.FinalizeBlock',
  3: 'execution.go — updateState',
};
