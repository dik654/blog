export const C = { send: '#6366f1', recv: '#10b981', ch: '#f59e0b', rate: '#8b5cf6' };

export const STEPS = [
  {
    label: 'MConnection 구조체 핵심 필드',
    body: 'TCP 소켓 + 다중화 채널 배열 + channelsIdx(ID→Channel) + 대역폭 모니터',
  },
  {
    label: 'OnStart() → sendRoutine + recvRoutine',
    body: 'sendRoutine(전송) + recvRoutine(수신) + ping/pong 타이머 동시 시작',
  },
  {
    label: 'sendRoutine — 우선순위 기반 전송',
    body: 'recentlySent/priority 비율로 채널 선택 — 우선순위 높은 채널이 더 자주 전송',
  },
  {
    label: 'recvRoutine — 채널ID 기반 라우팅',
    body: 'PacketMsg 수신 → channelID로 라우팅 → 조각 재조립 → onReceive 콜백',
  },
];

export const STEP_KEYS = ['mconn-struct', 'mconn-onstart', 'mconn-select-channel', 'mconn-recv-routine'];
export const STEP_LABELS = [
  'connection.go — MConnection struct',
  'connection.go — OnStart()',
  'connection.go — selectChannelToGossipOn()',
  'connection.go — recvRoutine()',
];
