import CodePanel from '@/components/ui/code-panel';
import GossipMeshViz from './viz/GossipMeshViz';
import {
  meshParams, propagationCode, propagationAnnotations,
  scoringCode, scoringAnnotations,
} from './GossipSubData';

export default function GossipSub({ title }: { title?: string }) {
  return (
    <section id="gossipsub" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'GossipSub: 메시 네트워크 & 메시지 전파'}</h2>
      <div className="not-prose mb-8"><GossipMeshViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          GossipSub은 <strong>메시 오버레이</strong>와 <strong>gossip 계층</strong>을
          결합한 pub/sub(발행/구독) 프로토콜입니다.<br />
          메시 피어에게는 전체 메시지를, 비-메시 피어에게는 IHAVE 메타데이터만 전송합니다.<br />
          대역폭과 전파 속도의 균형을 잡습니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h3>메시 파라미터</h3>
      </div>
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-border">
              {['파라미터', '기본값', '설명'].map(h => (
                <th key={h} className="text-left py-2 px-3 font-mono text-foreground/50">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {meshParams.map(p => (
              <tr key={p.param} className="border-b border-border/30">
                <td className="py-2 px-3 font-mono font-bold" style={{ color: p.color }}>{p.param}</td>
                <td className="py-2 px-3 font-mono text-foreground/60">{p.value}</td>
                <td className="py-2 px-3 text-foreground/70">{p.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">
        <h3>메시지 전파 흐름</h3>
        <CodePanel title="GossipSub 전파 과정" code={propagationCode}
          annotations={propagationAnnotations} />

        <h3>Peer Scoring (v1.1)</h3>
        <p>
          GossipSub v1.1은 피어 점수 시스템으로 Sybil 공격(가짜 노드 대량 생성)과
          메시지 스팸을 방어합니다.<br />
          점수가 임계값 미만이면 메시에서 제외됩니다.
        </p>
        <CodePanel title="Peer Scoring 파라미터" code={scoringCode}
          annotations={scoringAnnotations} />

        <h3 className="text-xl font-semibold mt-6 mb-3">GossipSub 프로토콜 동작</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GossipSub v1.1 Protocol Details
//
// Peer States per Topic:
//   - Fanout: 구독 안 한 topic, publishing만
//   - Mesh: subscribed topic의 inner peers
//   - Gossip: outer peers (metadata만)
//
// Mesh Maintenance (per heartbeat, 1s):
//
//   1. Prune excess peers
//      if |mesh| > D_hi: PRUNE random peers
//
//   2. Graft new peers
//      if |mesh| < D_lo: GRAFT from gossip
//
//   3. Gossip IHAVE
//      Recent messages metadata to non-mesh peers
//
//   4. Opportunistic grafting (v1.1)
//      Low-performing mesh peers 교체
//
// Control Messages:
//
//   GRAFT {topic}
//     "Add me to your mesh"
//
//   PRUNE {topic, peers, backoff}
//     "Remove me. Try these peers."
//     backoff: 재시도 대기 시간
//
//   IHAVE {topic, [message_ids]}
//     "I have these messages"
//
//   IWANT {[message_ids]}
//     "Send me these messages"

// Message Flow:
//
// Publisher → Mesh peers: full message
// Mesh peer A → Mesh peer B: full message
// A → non-mesh peers: IHAVE (via gossip)
// Receiver → A: IWANT (if interested)
// A → Receiver: full message

// Duplicate Detection:
//   seen_cache: LRU with TTL
//   message_id = hash(from || seqno || data)
//   TTL: 120 seconds (default)

// Validation Pipeline:
//   1. Syntax check
//   2. Signature verification (if signed)
//   3. Topic subscription check
//   4. Message validation hook (app-level)
//   5. Duplicate check
//   6. Forward to subscribers

// Security (v1.1 additions):
//   - Peer scoring
//   - Peer exchange (X discovery)
//   - Adaptive gossip
//   - Gossip factor per heartbeat

// Used in Ethereum 2.0:
//   Topics:
//     beacon_block
//     beacon_attestation_{subnet_id}
//     beacon_aggregate_and_proof
//     voluntary_exit
//     proposer_slashing
//     attester_slashing
//     sync_committee_contribution_and_proof
//
//   Validators: 수십만
//   Messages: 수천/초
//   Network: 분 단위 전파

// 타 프로젝트:
//   Filecoin: market messages
//   Polkadot: consensus messages
//   Starknet P2P: tx propagation`}
        </pre>
      </div>
    </section>
  );
}
