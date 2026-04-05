import BroadcasterViz from './viz/BroadcasterViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function BroadcasterTrait({ onCodeRef }: Props) {
  return (
    <section id="broadcaster-trait" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Broadcaster Trait & Buffered Engine</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>Broadcaster</code> trait — 메시지 전파의 최소 인터페이스
          <br />
          세 연관 타입: <code>Recipients</code>(수신 대상) · <code>Message: Codec</code>(직렬화) · <code>Response</code>(결과)
          <br />
          broadcast() → <code>oneshot::Receiver&lt;Response&gt;</code>로 비동기 결과 수신
        </p>
        <p className="leading-7">
          <strong>buffered::Engine</strong> — 실제 네트워크 처리 엔진
          <br />
          <code>select_loop!</code>으로 mailbox + network + peer 변경 동시 처리
          <br />
          피어별 <code>VecDeque</code>(LRU) + 전역 <code>BTreeMap</code>(items) + refcount로 메모리 관리
        </p>
        <p className="leading-7">
          <strong>Mailbox</strong>가 <code>Broadcaster</code> trait을 구현 — 외부 소비자는 trait만 의존
        </p>
      </div>
      <div className="not-prose mb-8">
        <BroadcasterViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Broadcaster Trait 구현 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Broadcaster Trait Architecture
//
// Core interface:
//
//   pub trait Broadcaster: Clone + Send + 'static {
//       type Recipients;
//       type Message: Codec;
//       type Response;
//
//       async fn broadcast(
//           &mut self,
//           recipients: Self::Recipients,
//           message: Self::Message,
//       ) -> oneshot::Receiver<Self::Response>;
//   }
//
// Design goals:
//   - Minimal surface area
//   - Async-friendly (oneshot channels)
//   - Type-generic (associated types)
//   - Engine-agnostic (multiple impls possible)

// Associated types explained:
//
//   Recipients:
//     "Who should receive this?"
//     Could be: single peer, set of peers, "all"
//     Allows different targeting strategies
//
//   Message: Codec:
//     Serializable payload type
//     Codec trait for wire format
//     Custom types: Proposal, Vote, Block, etc.
//
//   Response:
//     "What comes back from broadcast?"
//     Could be: ack count, certificate, error
//     Returned via oneshot channel

// Implementation: buffered::Engine
//
//   pub struct Engine<B: Blob, R: Receiver> {
//       mailbox_rx: mailbox::Receiver<Request>,
//       network: NetworkInterface<B>,
//       peers: BTreeMap<PeerId, PeerState>,
//       items: BTreeMap<ItemId, BufferedItem>,
//       peer_queues: BTreeMap<PeerId, VecDeque<ItemId>>,
//       max_buffer_size: usize,
//   }
//
//   select_loop! {
//       request = mailbox_rx.recv() => handle_request(request),
//       message = network.next_message() => handle_incoming(message),
//       peer_event = network.peer_events() => handle_peer_change(peer_event),
//   }

// Buffering strategy:
//
//   Per-peer queues (VecDeque):
//     LRU ordering
//     Bound on outstanding messages per peer
//     Drop oldest if buffer full
//
//   Global items map (BTreeMap):
//     Deduplication: same message sent to multiple peers
//     Reference counted (rc)
//     Freed when all peer queues release it
//
//   Why dedupe?
//     Same proposal going to 100 peers
//     Only stored once, reference held 100 times
//     Memory: O(items) instead of O(items * peers)

// Backpressure handling:
//
//   Problem: slow network/slow peer → buffer grows unbounded
//
//   Solutions:
//     1. Bounded per-peer queue (e.g. 100 msgs max)
//     2. Drop oldest (FIFO semantic preserved)
//     3. Alternative: drop lowest priority
//
//   Trade-off:
//     Drop → potential message loss
//     Block → global slowdown
//     Commonware prefers dropping (availability > durability)

// Network abstraction:
//
//   Engine uses NetworkInterface trait:
//     async fn send_to(peer_id, bytes)
//     async fn next_message() -> (peer_id, bytes)
//     async fn peer_events() -> PeerEvent
//
//   Decouples engine from P2P implementation
//   Could be QUIC, libp2p, custom TCP

// Mailbox pattern:
//
//   pub struct Mailbox<R> {
//       tx: mpsc::Sender<Request<R>>,
//   }
//
//   impl Broadcaster for Mailbox<...> {
//       async fn broadcast(&mut self, ...) -> oneshot::Receiver<Response> {
//           let (resp_tx, resp_rx) = oneshot::channel();
//           self.tx.send(Request { ..., resp_tx }).await?;
//           resp_rx
//       }
//   }
//
//   Why mailbox?
//     Engine runs in own task
//     External callers talk via channel
//     Natural async interface
//     Multiple clients via clone

// Error handling:
//
//   broadcast() returns oneshot::Receiver
//   Caller awaits receiver
//   Receiver returns:
//     Ok(response) - success
//     Err(Canceled) - engine crashed
//
//   Application can retry on failure
//   Retry policies outside engine scope

// Testing:
//   - Deterministic test executor
//   - Network partition simulation
//   - Backpressure tests
//   - Fuzz testing of buffered::Engine

// Production considerations:
//   Memory limits per peer/global
//   Message size limits
//   Peer connection limits
//   Connection health monitoring`}
        </pre>
      </div>
    </section>
  );
}
