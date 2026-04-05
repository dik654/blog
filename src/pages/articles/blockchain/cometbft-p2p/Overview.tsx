import ContextViz from './viz/ContextViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">P2P 스택 전체 구조</h2>
      <p className="text-sm text-muted-foreground mb-4">
        CometBFT P2P — MConnection(다중화) → Switch(피어 관리) → Reactor(메시지 핸들러) 3계층.<br />
        아래 step을 넘기며 각 계층의 역할과 소스 코드를 추적한다.
      </p>
      <div className="not-prose"><ContextViz onOpenCode={open} /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── P2P 3계층 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">P2P 3계층 아키텍처</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CometBFT P2P 3계층:
//
// Layer 1: MConnection (transport + multiplexing)
//   - 단일 TCP connection
//   - N개 channel 다중화 (channelID 1 byte)
//   - sendRoutine/recvRoutine goroutines
//   - Rate limiting (500KB/s default)
//
// Layer 2: Switch (connection management)
//   - Reactor 등록
//   - Peer 연결 관리 (DialPeer, AcceptPeer)
//   - Broadcast (모든 peer)
//   - PeerSet 관리
//
// Layer 3: Reactor (application logic)
//   - 각 reactor가 channel ID 소유
//   - Receive(Envelope) 핸들러
//   - AddPeer/RemovePeer 이벤트
//   - gossip 로직

// Reactor 종류:
// - ConsensusReactor (0x22): proposal/vote
// - MempoolReactor (0x20): TX gossip
// - BlockchainReactor (0x30): block sync
// - PEXReactor (0x40): peer exchange
// - StateSyncReactor (0x60): snapshot sync
// - EvidenceReactor (0x38): evidence gossip

// 데이터 흐름:
// outgoing:
// Reactor.Send(peer, chID, msg)
//   → Peer.Send(chID, msg)
//   → MConnection.Send(chID, bytes)
//   → sendRoutine goroutine
//   → TCP write
//
// incoming:
// TCP read
//   → recvRoutine goroutine
//   → MConnection.onReceive(chID, bytes)
//   → Switch.recvRoutine
//   → Reactor.Receive(Envelope)`}
        </pre>
        <p className="leading-7">
          P2P는 <strong>3계층 (MConnection/Switch/Reactor)</strong>.<br />
          Reactor가 channel ID로 메시지 타입 구분 → 독립 처리.<br />
          outgoing/incoming 양방향 goroutine으로 I/O 처리.
        </p>
      </div>
    </section>
  );
}
