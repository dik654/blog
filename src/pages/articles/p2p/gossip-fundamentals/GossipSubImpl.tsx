import GossipSubMeshViz from './viz/GossipSubMeshViz';
import CodePanel from '@/components/ui/code-panel';

const gsCode = `// GossipSub v1.1 (libp2p 명세)
// 메시 오버레이 파라미터:
//   D = 6     — 목표 메시 피어 수
//   D_lo = 4  — 최소 메시 피어 (미달 시 GRAFT)
//   D_hi = 12 — 최대 메시 피어 (초과 시 PRUNE)

// 메시지 전파 방식:
//   Mesh 피어 → 전체 메시지 직접 전송
//   Non-mesh 피어 → IHAVE(메시지 ID만) gossip
//     → 수신자가 없으면 IWANT으로 요청

// 제어 메시지:
//   GRAFT  — 메시에 참여 요청
//   PRUNE  — 메시에서 제거 알림
//   IHAVE  — 보유 메시지 ID 알림
//   IWANT  — 메시지 본문 요청`;

const gsAnnotations: { lines: [number, number]; color: 'sky' | 'emerald' | 'amber'; note: string }[] = [
  { lines: [1, 5], color: 'sky', note: '메시 파라미터 — D, D_lo, D_hi로 동적 조절' },
  { lines: [7, 10], color: 'emerald', note: '이중 전파 — 메시: full, 비메시: IHAVE' },
  { lines: [12, 16], color: 'amber', note: '4종 제어 메시지' },
];

export default function GossipSubImpl() {
  return (
    <section id="gossipsub" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GossipSub 구현</h2>
      <div className="not-prose mb-8"><GossipSubMeshViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          GossipSub은 libp2p의 pub/sub 프로토콜입니다.
          <strong>메시 오버레이</strong>와 <strong>gossip 레이어</strong>를 결합합니다.<br />
          메시 피어에게는 전체 메시지를, 비-메시 피어에게는 IHAVE 메타데이터만 전송합니다.
        </p>
        <CodePanel title="GossipSub 메시 구조" code={gsCode}
          annotations={gsAnnotations} />
        <p className="leading-7">
          Ethereum Beacon Chain은 GossipSub v1.1로 블록과 증명을 전파합니다.<br />
          libp2p에서는 rust-libp2p의 gossipsub 모듈로 구현됩니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">GossipSub 동작 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GossipSub v1.1 (libp2p)
//
// Mesh Overlay:
//   Topic별 별도 mesh 유지
//   - D = 6 (target fanout)
//   - D_lo = 4, D_hi = 12
//   - Heartbeat (1s): mesh 상태 점검
//
// Message Flow:
//
// 1. Publishing
//    Publisher → Mesh peers (full message)
//    Publisher → Fanout peers (if not subscribed)
//
// 2. Mesh Maintenance
//    매 heartbeat:
//      if mesh_size < D_lo: GRAFT (add peers)
//      if mesh_size > D_hi: PRUNE (remove peers)
//      Rebalance towards D
//
// 3. Gossip
//    Non-mesh peers: send IHAVE (metadata)
//    Receiver: IWANT (request full msg)
//    → 누락 복구, backup path

// Control Messages:
//   GRAFT: "Add me to your mesh"
//   PRUNE: "Remove me from mesh"
//   IHAVE: "I have msg X, Y, Z"
//   IWANT: "Send me X, Y"

// Anti-entropy:
//   Seen messages: LRU cache (2 min TTL)
//   msg_id = hash(message)
//   중복 차단 → 네트워크 효율

// Peer Scoring (v1.1):
//   Multi-factor score 계산:
//     - Topic activity (MPS, mesh time)
//     - First message deliveries
//     - Mesh message deliveries
//     - Invalid message penalty
//     - IP colocation penalty
//
//   Score thresholds:
//     graylist (-12): 메시 제외
//     publish (0): 메시지 발행 차단
//     accept (0): 메시지 수용 차단

// Ethereum 사용 예:
//   Topics:
//     beacon_block
//     beacon_attestation_{subnet}
//     beacon_aggregate_and_proof
//     voluntary_exit
//     proposer_slashing
//     attester_slashing
//
//   수만 validators에서 초당 수천 메시지
//   분 단위 이내 전 네트워크 전파`}
        </pre>
      </div>
    </section>
  );
}
