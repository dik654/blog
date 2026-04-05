import CodePanel from '@/components/ui/code-panel';
import HolePunchViz from './viz/HolePunchViz';
import {autonatCode, autonatAnnotations, relayCode, dcutrCode, } from './NATTraversalData';

export default function NATTraversal({ title }: { title?: string }) {
  return (
    <section id="nat-traversal" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'NAT Traversal: AutoNAT, Relay, Hole Punching'}</h2>
      <div className="not-prose mb-8"><HolePunchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          NAT 뒤의 피어가 직접 연결하려면 3단계 전략이 필요합니다:
          <strong> AutoNAT</strong>(탐지) → <strong>Relay</strong>(중계) → <strong>DCUtR</strong>(직접 연결 업그레이드).
        </p>

        <h3>AutoNAT: NAT 타입 탐지</h3>
        <CodePanel title="AutoNAT 프로토콜" code={autonatCode}
          annotations={autonatAnnotations} />

        <h3>Circuit Relay v2</h3>
        <p>
          // Circuit Relay v2<br />
          // NAT 뒤 피어 A, B가 Relay 서버 R을 경유:<br />
          // A R B<br />
          // /p2p-circuit/p2p/12D3KooWB<br />
          // Relay 제한 (v2):<br />
          // - 최대 128 동시 예약<br />
          // - 예약당 최대 120초 TTL<br />
          // - 대역폭 제한: 128 KiB/s<br />
          // - 데이터 전송 제한: 16 KiB/패킷<br />
          // A → R: Reserve (예약 요청)<br />
          // R → A: Reservation(Ok) + 릴레이 주소 발급<br />
          // B → R → A: 중계 연결 수립
        </p>

        <h3>DCUtR: Hole Punching</h3>
        <p>
          Relay 중계 연결은 지연이 높고 대역폭이 제한됩니다.<br />
          DCUtR(Direct Connection Upgrade through Relay)은
          Relay 경유 연결을 직접 연결로 업그레이드합니다.
        </p>
        <p>
          <strong>DCUtR</strong> (Direct Connection Upgrade through Relay)<br />
          전제: A, B 모두 Relay R에 연결된 상태<br />
          1. A → B (via R): Connect — A의 관찰 외부 주소 전달<br />
          2. B → A (via R): Connect — B의 관찰 외부 주소 전달<br />
          3. 동시 Dial (Simultaneous Open) — NAT 테이블에 아웃바운드 매핑 생성<br />
          4. 직접 연결 성공 → Relay 연결 종료 (지연: ~100ms → {'<'}10ms)
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">libp2p NAT 전략 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// libp2p NAT Traversal Stack
//
// 3단계 전략:
//
// Stage 1: AutoNAT (Detection)
//   목적: NAT 뒤에 있는지 자가 진단
//   방법:
//     - 다른 peer에게 dial 요청
//     - 관찰된 주소 보고 받음
//     - Observed address 통계화
//
//   결과 상태:
//     - Public: 직접 접근 가능
//     - Private: NAT/firewall 뒤
//     - Unknown: 불확실
//
// Stage 2: Circuit Relay v2 (Fallback)
//   목적: Private peer 간 중계 연결
//
//   Reservation model (DoS 방지):
//     - 각 relay: 최대 128 reservations
//     - TTL: 120 seconds
//     - Bandwidth: 128 KiB/s
//     - Data limit: 2 MiB / connection
//
//   Protocol:
//     /libp2p/circuit/relay/0.2.0/hop
//     /libp2p/circuit/relay/0.2.0/stop
//
// Stage 3: DCUtR (Direct Connection Upgrade)
//   목적: Relay → Direct 업그레이드
//
//   Protocol ID: /libp2p/dcutr
//
//   흐름:
//     A → B (via R): CONNECT (with A's candidates)
//     B → A (via R): CONNECT (with B's candidates)
//     Simultaneous TCP/QUIC dial
//     NAT mapping 동시 생성
//     Direct connection established
//
// 성공률:
//   - Cone NAT: 90%+
//   - Port-restricted: 70%+
//   - Symmetric: 10-20%
//
//   실패 시 → Relay 유지 (낮은 QoS)

// 사용 모델:
//
// Public node (예: Bootstrap):
//   - AutoNAT 불필요
//   - Relay 제공자 가능
//   - Full connectivity
//
// Private node (집 컴퓨터):
//   - AutoNAT로 자가 진단
//   - 공개 Relay 사용
//   - DCUtR로 업그레이드 시도
//
// Mobile/VPN:
//   - 주로 Symmetric NAT
//   - Relay 지속 필요
//   - QUIC over UDP 유리`}
        </pre>
      </div>
    </section>
  );
}
