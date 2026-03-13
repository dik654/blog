import { CitationBlock } from '../../../../components/ui/citation';

export default function P2PLayer() {
  return (
    <section id="p2p-layer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">P2P 네트워킹</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT의 P2P 레이어는 이더리움의 devp2p/libp2p와 비교됩니다.
          이더리움 EL이 devp2p(RLPx)를, CL이 libp2p를 사용하는 반면,
          CometBFT는 자체 <strong>멀티플렉스 연결(MConnection)</strong> 기반의
          Gossip 프로토콜을 사용합니다.
        </p>
        <CitationBlock source="cometbft/p2p/conn/connection.go" citeKey={5} type="code" href="https://github.com/cometbft/cometbft/blob/main/p2p/conn/connection.go">
          <pre className="text-xs overflow-x-auto"><code>{`// MConnection (multiplex connection) multiplexes N channels
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
}`}</code></pre>
          <p className="mt-2 text-xs text-muted-foreground">MConnection은 단일 TCP 연결 위에 여러 채널을 멀티플렉싱합니다. 각 Reactor(Consensus, Mempool 등)가 고유 채널 ID로 등록되어 독립적으로 메시지를 송수신합니다.</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">P2P 스택 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">계층</th>
                <th className="border border-border px-4 py-2 text-left">이더리움</th>
                <th className="border border-border px-4 py-2 text-left">CometBFT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">노드 발견</td>
                <td className="border border-border px-4 py-2">Discv4/v5 (Kademlia DHT)</td>
                <td className="border border-border px-4 py-2">PEX (Peer Exchange) Reactor</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">전송</td>
                <td className="border border-border px-4 py-2">RLPx (EL) / libp2p (CL)</td>
                <td className="border border-border px-4 py-2">MConnection (멀티플렉스 TCP)</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">메시지 전파</td>
                <td className="border border-border px-4 py-2">Gossip (eth, snap 프로토콜)</td>
                <td className="border border-border px-4 py-2">Reactor 패턴 기반 Gossip</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">노드 ID</td>
                <td className="border border-border px-4 py-2">secp256k1 공개키</td>
                <td className="border border-border px-4 py-2">Ed25519 공개키</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">Reactor 패턴</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`CometBFT Reactor들:
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
  → PEX가 good 피어 우선 발견`}</code>
        </pre>
      </div>
    </section>
  );
}
