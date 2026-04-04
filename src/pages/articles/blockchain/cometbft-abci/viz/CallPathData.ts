export const C = {
  exec: '#6366f1',   // BlockExecutor
  proxy: '#f59e0b',  // AppConnConsensus (proxy)
  local: '#0ea5e9',  // localClient
  app: '#10b981',    // Application
  grpc: '#8b5cf6',   // gRPC client
};

export const STEPS = [
  {
    label: '4개 연결 — 독립 클라이언트',
    body: 'AppConns 4개 연결이 별도 ABCI Client — clientCreator가 전송 모드 결정',
  },
  {
    label: 'Local 모드 — 직접 함수 호출',
    body: 'localClient: Mutex로 동기화, 직렬화 없이 함수 직접 호출 — Cosmos SDK 기본',
  },
  {
    label: '전체 호출 경로',
    body: 'BlockExecutor → AppConnConsensus → localClient → app — 프록시가 전송 모드 추상화',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'app-conns', 1: 'local-client', 2: 'application-interface',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'app_conn.go — AppConns',
  1: 'local_client.go',
  2: 'application.go',
};
