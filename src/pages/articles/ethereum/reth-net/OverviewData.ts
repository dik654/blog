export interface NetLayer {
  id: string;
  label: string;
  role: string;
  details: string;
  why: string;
  color: string;
}

export const NET_LAYERS: NetLayer[] = [
  {
    id: 'discovery',
    label: 'Discovery (discv4)',
    role: 'UDP 기반 피어 탐색',
    details:
      'Kademlia DHT 변형. FIND_NODE 메시지로 XOR 거리가 가까운 노드를 반복 탐색한다. ' +
      '256개 k-bucket에 피어를 분류하고, 주기적 refresh로 연결성을 유지.',
    why: '왜 UDP? TCP 핸드셰이크 없이 수천 노드를 빠르게 탐색 가능. 실제 데이터 교환은 TCP.',
    color: '#6366f1',
  },
  {
    id: 'rlpx',
    label: 'RLPx Transport',
    role: 'TCP 암호화 연결',
    details:
      'ECIES 핸드셰이크로 세션 키 교환 후, AES-CTR + HMAC으로 모든 프레임을 암호화한다. ' +
      'DevP2P 표준 — Geth, Erigon, Nethermind 모두 동일 프로토콜.',
    why: '왜 자체 암호화? TLS 이전에 설계됨. 노드 ID = secp256k1 공개키이므로 별도 인증서 불필요.',
    color: '#0ea5e9',
  },
  {
    id: 'session',
    label: 'SessionManager',
    role: '세션 상태 머신',
    details:
      'Pending → Active → Disconnecting 상태 전이를 관리한다. ' +
      'tokio select!로 단일 이벤트 루프에서 모든 세션의 I/O를 처리.',
    why: '왜 단일 루프? Geth의 goroutine-per-connection 대비 메모리 사용량이 10배 이상 적다.',
    color: '#10b981',
  },
  {
    id: 'eth-wire',
    label: 'eth/68 Protocol',
    role: '블록·TX 메시지 교환',
    details:
      'eth/68은 NewPooledTransactionHashes에 타입+크기를 추가한 최신 버전. ' +
      '수신 측이 필요한 TX만 선별 요청하여 대역폭을 최대 50% 절감.',
    why: '왜 eth/68? eth/67까지는 해시만 전송 → 대형 TX도 무조건 수신. 크기 정보로 필터링 가능.',
    color: '#f59e0b',
  },
];
