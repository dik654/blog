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
      </div>
    </section>
  );
}
