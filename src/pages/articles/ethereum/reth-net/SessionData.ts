export interface SessionState {
  id: string;
  label: string;
  desc: string;
  color: string;
}

export const SESSION_STATES: SessionState[] = [
  {
    id: 'pending',
    label: 'Pending',
    desc: 'RLPx 핸드셰이크 진행 중. ECIES 키 교환 후 Status 메시지를 교환한다. 체인 ID, 제네시스 해시, 최신 블록이 일치해야 Active로 진행.',
    color: '#f59e0b',
  },
  {
    id: 'active',
    label: 'Active',
    desc: 'eth 프로토콜 메시지를 주고받는 상태. SessionManager가 mpsc 채널로 각 세션의 이벤트를 수신하고, 네트워크 매니저에 전달한다.',
    color: '#10b981',
  },
  {
    id: 'disconnecting',
    label: 'Disconnecting',
    desc: 'Disconnect 메시지 수신 또는 타임아웃. 세션 맵에서 제거되고 피어 평판(reputation)이 갱신된다. 악성 피어는 밴 리스트에 추가.',
    color: '#ef4444',
  },
];

export interface GethVsReth {
  aspect: string;
  geth: string;
  reth: string;
}

export const GETH_VS_RETH: GethVsReth[] = [
  { aspect: '동시성 모델', geth: 'goroutine per connection', reth: 'tokio 단일 이벤트 루프' },
  { aspect: '메모리 (100 피어)', geth: '~8KB/goroutine stack', reth: '~수백 바이트/세션 상태' },
  { aspect: '세션 상한', geth: 'maxPeers (기본 50)', reth: 'max_sessions (기본 100)' },
  { aspect: '이벤트 전달', geth: 'Go 채널', reth: 'tokio mpsc 채널' },
];
