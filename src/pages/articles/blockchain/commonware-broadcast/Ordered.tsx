import OrderedViz from './viz/OrderedViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Ordered({ onCodeRef }: Props) {
  return (
    <section id="ordered" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ordered_broadcast: 인증서 체인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          핵심 타입 3종: <code>Chunk</code>(sequencer + height + payload) · <code>Parent</code>(이전 인증서) · <code>Node</code>(Chunk + sig + Parent)
          <br />
          각 시퀀서가 독립 체인 — Node(h=N).parent.certificate = h=N-1의 쿼럼 인증서
          <br />
          height 0이면 Parent = None (genesis)
        </p>
        <p className="leading-7">
          <strong>Engine</strong>의 <code>select_loop!</code> — 노드 수신 → <code>read_staged()</code> 디코딩 → <code>validate_node()</code> 서명 검증
          <br />
          <strong>AckManager</strong> — 부분 서명 수집. 3중 Map: Sequencer → Height → Epoch → Evidence
          <br />
          2f+1 쿼럼 달성 → <code>Partials</code>에서 <code>Certificate</code>로 승격
        </p>
        <p className="leading-7">
          <strong>TipManager</strong> — 시퀀서별 최신 Node 추적. tip 존재 = 전체 체인(h=0~N) 확인됨
        </p>
      </div>
      <div className="not-prose mb-8">
        <OrderedViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Ordered Broadcast 프로토콜</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Ordered Broadcast Protocol
//
// Goal:
//   Establish causal ordering per "sequencer"
//   Multiple sequencers broadcast concurrently
//   Each chain tracked independently
//   Certificates prove quorum agreement

// Core types:
//
//   struct Chunk {
//       sequencer: PublicKey,
//       height: u64,
//       payload: Bytes,
//   }
//
//   enum Parent {
//       None,                     // genesis
//       Some(Certificate),        // ref to previous height
//   }
//
//   struct Node {
//       chunk: Chunk,
//       signature: Signature,     // sequencer's sig
//       parent: Parent,
//   }
//
//   struct Certificate {
//       sequencer: PublicKey,
//       height: u64,
//       payload_hash: Hash,
//       quorum_signature: AggSignature,  // BLS aggregate
//   }

// Chain structure:
//
//   Each sequencer has own chain:
//
//     Node(seq=S, h=0) → Node(seq=S, h=1) → Node(seq=S, h=2) → ...
//       parent=None     parent=cert(h=0)    parent=cert(h=1)
//
//   Chain is linear per-sequencer
//   Different sequencers run independently
//   No global ordering (yet)

// Engine flow:
//
//   async fn handle_incoming_node(&mut self, node: Node) {
//       // 1. Parse & validate format
//       let chunk = &node.chunk;
//
//       // 2. Verify sequencer signature
//       if !verify_signature(&chunk, &node.signature, &chunk.sequencer) {
//           return;
//       }
//
//       // 3. Validate parent certificate (if any)
//       if let Parent::Some(cert) = &node.parent {
//           if !self.validate_parent(cert, chunk.height - 1) {
//               return;
//           }
//       }
//
//       // 4. Check if we've seen this node
//       let node_hash = hash(&node);
//       if self.ack_manager.has_node(node_hash) {
//           return;
//       }
//
//       // 5. Sign acknowledgement (partial signature)
//       let my_ack = self.sign_ack(&node);
//
//       // 6. Broadcast our ack
//       self.broadcast_ack(my_ack).await;
//
//       // 7. Update tip for this sequencer
//       self.tip_manager.update(chunk.sequencer, node);
//   }

// AckManager — partial signature aggregation:
//
//   struct AckManager {
//       // Sequencer → Height → Epoch → Evidence
//       evidence: BTreeMap<
//           PublicKey,
//           BTreeMap<u64, BTreeMap<u64, Evidence>>
//       >,
//   }
//
//   enum Evidence {
//       Partials(BTreeMap<ValidatorIndex, PartialSig>),
//       Certificate(Certificate),
//   }
//
//   On receiving Ack(sequencer, height, sig, validator_id):
//     1. Add to Partials map
//     2. Count distinct validators: n
//     3. If n >= quorum_threshold (2f+1):
//        - Aggregate partial signatures
//        - Produce Certificate
//        - Transition state: Partials → Certificate

// TipManager — latest node per sequencer:
//
//   struct TipManager {
//       tips: BTreeMap<PublicKey, Node>,
//   }
//
//   fn update(&mut self, sequencer: PublicKey, node: Node) {
//       let current = self.tips.get(&sequencer);
//       if current.is_none()
//          || current.unwrap().chunk.height < node.chunk.height {
//           self.tips.insert(sequencer, node);
//       }
//   }
//
//   // Tip existence means:
//   // "We have validated all heights 0..=tip.height"
//   // "Chain is complete for this sequencer"

// BLS signature aggregation:
//
//   Each validator i has private key sk_i
//   Ack signature: sig_i = Sign(sk_i, (sequencer, height, payload_hash))
//
//   Aggregate:
//     agg_sig = sum(sig_i)  (in G1)
//     agg_pk = sum(pk_i)   (in G2)
//
//   Verify:
//     e(agg_sig, G2) == e(hash_to_g1(msg), agg_pk)
//
//   Quorum: 2f+1 out of 3f+1 validators (Byzantine tolerance)

// Epoch rotation:
//
//   Validator set changes over time (membership updates)
//   Each epoch has its own validator list
//   Certificates must be within-epoch
//   Cross-epoch: carry over via reconfiguration

// Benefits vs flat broadcast:
//
//   1. Parallelism: multiple sequencers = higher throughput
//   2. Decoupling: chains isolated from each other
//   3. Efficient storage: only need latest tip
//   4. Quorum safety: 2f+1 threshold
//   5. Self-describing: parent certs validate full chain

// Integration with consensus:
//   Consensus orders TIPS (not full data)
//   Data already propagated via ordered_broadcast
//   Very small consensus payload (hashes only)
//   Enables high-throughput DSMR pattern`}
        </pre>
      </div>
    </section>
  );
}
