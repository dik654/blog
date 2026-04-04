export const C = { abci: '#6366f1', app: '#10b981', grpc: '#f59e0b', local: '#0ea5e9', err: '#ef4444' };

export const STEPS = [
  {
    label: '왜 ABCI가 필요한가',
    body: '합의 엔진과 앱 로직을 분리 → 합의를 다른 앱에도 재사용 가능',
  },
  {
    label: '문제: 결합 vs 분리',
    body: 'ABCI는 인터페이스만 정의하고 전송 모드(local/socket/gRPC)는 선택 가능',
  },
  {
    label: '합의 호출 순서',
    body: 'PrepareProposal → ProcessProposal → FinalizeBlock → Commit 순서로 호출',
  },
  {
    label: '3가지 전송 모드',
    body: 'Local(직접 호출, 가장 빠름), Socket(IPC), gRPC(원격, protobuf)',
  },
  {
    label: '4개 연결 분리',
    body: 'Consensus/Mempool/Query/Snapshot 4개 연결이 독립적으로 동작',
  },
];
