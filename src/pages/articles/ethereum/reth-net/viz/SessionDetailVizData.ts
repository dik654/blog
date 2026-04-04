export const C = { dial: '#6366f1', ecies: '#8b5cf6', hello: '#f59e0b', active: '#10b981', close: '#ef4444' };

export const STEPS = [
  {
    label: 'dial() — TCP 연결 시작',
    body: 'TcpStream::connect로 비동기 연결 후 pending 세션으로 등록합니다.',
  },
  {
    label: 'ECIES 핸드셰이크',
    body: 'auth/ack 교환 후 ECDH로 공유 비밀을 생성하여 AES-CTR 암호화 키를 도출합니다.',
  },
  {
    label: 'Hello 메시지 — capabilities 교환',
    body: '프로토콜 버전과 capabilities를 교환하여 eth/68 지원 여부를 확인합니다.',
  },
  {
    label: 'SessionEstablished — 활성 세션',
    body: 'pending에서 active 세션으로 전환되어 eth-wire 메시지 교환을 시작합니다.',
  },
  {
    label: 'SessionClosed — 정리',
    body: '정상 종료 또는 에러 시 active 세션 맵에서 제거하고 max_sessions 카운트를 복구합니다.',
  },
];
