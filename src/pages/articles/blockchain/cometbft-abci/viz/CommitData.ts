export const C = {
  exec: '#6366f1',   // BlockExecutor
  proxy: '#f59e0b',  // AppConnConsensus
  local: '#0ea5e9',  // localClient
  app: '#10b981',    // Application
  mem: '#8b5cf6',    // mempool
  store: '#ec4899',  // state store
};

export const STEPS = [
  {
    label: '① appConn.Commit — 앱 상태 영구 저장',
    body: 'app.Commit → 앱 상태 디스크 커밋, RetainHeight 반환으로 보관 기간 결정',
  },
  {
    label: '② pruneBlocks — 오래된 블록 정리',
    body: 'RetainHeight > 0이면 이전 블록 데이터 삭제 — 디스크 공간 절약',
  },
  {
    label: '③ mempool.Update — 실행된 TX 제거',
    body: '블록에 포함된 TX를 mempool에서 제거 — 실패한 TX도 TxResults Code로 제거',
  },
  {
    label: '④ store.Save — CometBFT 상태 저장',
    body: 'store.Save(state) — 반드시 app Commit 이후에 실행 (역순이면 상태 불일치)',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'proxy-commit', 1: 'apply-block-commit', 2: 'apply-block-commit', 3: 'apply-block-commit',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'app_conn_consensus.go → local_client.go',
  1: 'execution.go — pruneBlocks',
  2: 'execution.go — mempool.Update',
  3: 'execution.go — store.Save',
};
