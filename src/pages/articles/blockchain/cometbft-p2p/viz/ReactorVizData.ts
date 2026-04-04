export const C = { reactor: '#f59e0b', peer: '#6366f1', send: '#10b981' };

export const STEPS = [
  {
    label: 'peer.Send() — proto.Marshal → mconn.Send()',
    body: 'protobuf 직렬화 → mconn.Send로 채널 sendQueue에 삽입 (블로킹, 10초 타임아웃)',
  },
  {
    label: 'peer.TrySend() — 논블로킹 대안',
    body: 'sendQueue 가득 차면 즉시 false — 손실 허용 가능한 합의 메시지에 사용',
  },
  {
    label: 'peer.OnStart() → mconn.Start()',
    body: 'mconn.Start() → sendRoutine + recvRoutine 고루틴 2개 생성',
  },
  {
    label: 'Reactor.Receive() — recvRoutine에서 동기 호출',
    body: 'recvRoutine에서 동기 호출 — Receive()가 느리면 해당 피어 수신 블로킹',
  },
];

export const STEP_KEYS = ['peer-send', 'peer-send', 'peer-onstart', 'mconn-recv-routine'];
export const STEP_LABELS = [
  'peer.go — Send()',
  'peer.go — TrySend()',
  'peer.go — OnStart()',
  'connection.go — recvRoutine() → onReceive',
];
