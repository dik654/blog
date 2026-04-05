import HolePunchViz from './viz/HolePunchDetailViz';
import CodePanel from '@/components/ui/code-panel';

const hpCode = `// UDP Hole Punching 절차
// 1. A, B 모두 STUN으로 외부 주소 발견
// 2. 시그널링 채널로 서로의 외부 주소 교환
// 3. A → B의 외부 주소로 UDP 패킷 전송
//    (B의 NAT에서 드롭되지만 A의 NAT에 매핑 생성)
// 4. B → A의 외부 주소로 UDP 패킷 전송
//    (A의 NAT 매핑이 이미 존재 → 통과!)
// 5. 양방향 NAT 매핑 완성 → 직접 통신

// TCP Hole Punching:
//   동시에 SYN 전송 → Simultaneous Open
//   성공률이 UDP보다 낮음 (NAT/방화벽 정책 의존)
//   QUIC(UDP) 사용 시 TCP 홀 펀칭 불필요`;

const hpAnnotations: { lines: [number, number]; color: 'sky' | 'emerald'; note: string }[] = [
  { lines: [1, 8], color: 'sky', note: 'UDP 홀 펀칭 — 동시 전송으로 NAT 매핑 생성' },
  { lines: [10, 13], color: 'emerald', note: 'TCP 홀 펀칭 — Simultaneous Open, 낮은 성공률' },
];

export default function HolePunching() {
  return (
    <section id="hole-punching" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Hole Punching 기법</h2>
      <div className="not-prose mb-8"><HolePunchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Hole Punching은 NAT 뒤의 두 피어가 직접 연결하는 핵심 기법입니다.<br />
          양쪽이 동시에 상대의 NAT 외부 주소로 패킷을 보내
          NAT 매핑을 상호 생성합니다.
        </p>
        <CodePanel title="Hole Punching 절차" code={hpCode}
          annotations={hpAnnotations} />
        <p className="leading-7">
          Symmetric NAT에서는 목적지마다 매핑이 달라 홀 펀칭이 실패합니다.<br />
          이 경우 TURN(iroh의 DERP, libp2p의 Circuit Relay)이 유일한 대안입니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Hole Punching 시퀀스 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// UDP Hole Punching 완전 시퀀스
//
// 준비:
//   Peer A: 10.0.0.5:5000 (private)
//   Peer B: 192.168.1.10:6000 (private)
//   Signaling: via rendezvous server
//
// Phase 1: External address discovery
//   A → STUN → A_ext: 203.0.113.5:40000
//   B → STUN → B_ext: 198.51.100.10:50000
//
// Phase 2: Signaling (via server)
//   A → Server: "I want to connect to B. I am A_ext"
//   Server → B: "A_ext = 203.0.113.5:40000"
//   Server → A: "B_ext = 198.51.100.10:50000"
//
// Phase 3: Simultaneous hole punching
//   A → B_ext (packet 1):
//     - A NAT: creates mapping for B_ext
//     - B NAT: drops (no prior mapping)
//
//   B → A_ext (packet 2):
//     - B NAT: creates mapping for A_ext
//     - A NAT: PASSES (matches step 1 mapping!)
//
//   Now B sees A's packet, responds:
//   B → A_ext (packet 3): SUCCESS
//
// Phase 4: Bi-directional established
//   A ↔ B direct UDP connection ✓

// 시간 동기화:
//   동시 전송 필수 (± 500ms 이내)
//   Server의 timestamp 사용
//   Retry with exponential backoff

// Failure modes:
//   1. Symmetric NAT (A or B)
//      → 다른 목적지 = 다른 매핑
//      → 예측 불가
//   2. Strict firewall
//      → 모든 inbound drop
//   3. Timing off
//      → Packet loss on either side
//   4. NAT timeout
//      → Keep-alive 필요

// libp2p DCUtR (Direct Connection Upgrade thru Relay):
//   1. Relay로 초기 연결
//   2. Connect message with external addrs
//   3. Simultaneous TCP/UDP dial
//   4. Upgrade to direct connection

// WebRTC uses similar:
//   STUN + TURN + ICE = WebRTC NAT traversal
//   Trickle ICE (incremental candidate exchange)`}
        </pre>
      </div>
    </section>
  );
}
