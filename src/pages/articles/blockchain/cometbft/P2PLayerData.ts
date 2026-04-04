export const MCONNECTION_CODE = `// MConnection (multiplex connection) multiplexes N channels
// over a single TCP connection with authenticated encryption.
// Each channel has a globally unique ID (byte).
// Channels are registered at connection creation time.
type MConnection struct {
    conn          net.Conn
    channels      []*channel
    channelsIdx   map[byte]*channel
    sendMonitor   *flow.Monitor
    recvMonitor   *flow.Monitor
    send          chan struct{}
    pong          chan struct{}
}`;

export const P2P_TABLE_ROWS = [
  { layer: '노드 발견', eth: 'Discv4/v5 (Kademlia DHT)', cmt: 'PEX (Peer Exchange) Reactor' },
  { layer: '전송', eth: 'RLPx (EL) / libp2p (CL)', cmt: 'MConnection (멀티플렉스 TCP)' },
  { layer: '메시지 전파', eth: 'Gossip (eth, snap 프로토콜)', cmt: 'Reactor 패턴 기반 Gossip' },
  { layer: '노드 ID', eth: 'secp256k1 공개키', cmt: 'Ed25519 공개키' },
] as const;

export const REACTOR_CODE = `CometBFT Reactor들:
┌──────────────────────────────────────────┐
│ MConnection (멀티플렉스 TCP 연결)         │
├──────────────────────────────────────────┤
│ Channel 0x20: Mempool Reactor            │
│  → 트랜잭션 전파 (이더리움 txpool 역할)    │
├──────────────────────────────────────────┤
│ Channel 0x22: Consensus Reactor          │
│  → Proposal, Prevote, Precommit 전파     │
├──────────────────────────────────────────┤
│ Channel 0x30: Blockchain Reactor         │
│  → 블록 동기화 (이더리움 snap sync 유사)   │
├──────────────────────────────────────────┤
│ Channel 0x40: PEX Reactor                │
│  → 피어 교환 (이더리움 discv5 유사)        │
├──────────────────────────────────────────┤
│ Channel 0x60: State Sync Reactor         │
│  → 상태 스냅샷 동기화                      │
├──────────────────────────────────────────┤
│ Channel 0x70: Evidence Reactor           │
│  → 이중 서명 증거 전파 (슬래싱 증거)        │
└──────────────────────────────────────────┘

연결 보안:
  1. Station-to-Station 프로토콜로 인증된 암호화
  2. X25519 Diffie-Hellman 키 교환
  3. chacha20poly1305 대칭 암호화
  4. 핸드셰이크: 암호화 → CometBFT 버전 협상

Switch (P2P 핵심 컴포넌트):
  → 모든 Reactor를 관리하고 피어 연결 추적
  → 각 Reactor가 채널을 등록
  → Send()(블로킹) / TrySend()(논블로킹) 메시지 전송

Sentry Node 아키텍처 (이더리움 유사):
  검증자 → PEX 비활성화, persistent peer만 연결
  센트리 노드 → PEX 활성화, 공개 네트워크 대면
  (이더리움 검증자의 private peering과 동일 패턴)

Peer Quality:
  합의 프로토콜에서 유용한 투표/블록 파트 10,000개 수집 시
  → 해당 피어를 "good"으로 마킹
  → PEX가 good 피어 우선 발견`;
