import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import NATTypesViz from "./nat-traversal/viz/NATTypesViz";
import STUNViz from "./nat-traversal/viz/STUNViz";
import TURNViz from "./nat-traversal/viz/TURNViz";
import ICEViz from "./nat-traversal/viz/ICEViz";
import HolePunchViz from "./nat-traversal/viz/HolePunchDetailViz";

export default function NatTraversalArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          사설 주소의 두 피어가 실제로 통하는 경로 찾기
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Alice와 Bob이 각각 다른 가정용 router 뒤에 있다고 하자. 둘의
            192.168.x.x 주소는 인터넷에서 직접 dial할 수 없다. NAT는 outbound
            packet을 보낼 때 private transport address를 public address로
            mapping하고, inbound packet을 어떤 remote endpoint에서 받아들일지
            filtering한다. 같은 장비도 mapping과 filtering behavior 조합이
            다를 수 있으므로 오래된 cone 이름 하나로 성공을 단정하지 않는다.
          </p>
          <p>
            고정 흐름은 STUN으로 각자가 관측된 public address를 얻고, signaling
            channel로 candidate를 교환하고, ICE connectivity check로 실제
            bidirectional path를 시험하는 것이다. Direct pair가 성공하면 그
            transport를 사용하고, 실패하면 TURN relay candidate를 선택한다.
            Identity authentication과 application encryption은 이 경로 탐색과
            별도 책임이며, STUN 응답 주소만으로 상대 identity를 증명할 수 없다.
          </p>
        </div>

        <div className="not-prose my-8">
          <NATTypesViz />
        </div>
      </section>

      <section id="stun" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">STUN: 서버가 본 source address 알아내기</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Alice가 STUN server에 Binding request를 보내면 server는 UDP envelope의
            source IP와 port를 XOR-MAPPED-ADDRESS에 넣어 success response를 보낸다.
            Alice는 96-bit transaction ID로 응답을 요청과 맞추고 address family를
            확인한다. 이 server-reflexive address는 “그 STUN server로 보낸 그
            flow가 이렇게 보였다”는 관찰값이다.
          </p>
          <p>
            Basic STUN Binding 한 번은 NAT type을 완전히 판별하지 않고 inbound
            hole을 유지하지도 않으며 relay도 제공하지 않는다. 다른 목적지에서
            같은 mapping이 생기는지, 어떤 inbound source가 허용되는지는 별도
            behavior discovery 또는 실제 connectivity check로 확인해야 한다.
          </p>
        </div>

        <div className="not-prose my-8">
          <STUNViz />
        </div>

        <CitationBlock
          source="RFC 8489 — Session Traversal Utilities for NAT"
          citeKey={1}
          href="https://www.rfc-editor.org/rfc/rfc8489.html"
        >
          <div id="paper-stun" className="space-y-1 text-sm leading-6">
            <p><strong>문제:</strong> Endpoint가 NAT가 바꾼 reflexive transport address를 알아야 한다.</p>
            <p><strong>기여:</strong> STUN message, transaction과 XOR-MAPPED-ADDRESS processing을 표준화한다.</p>
            <p><strong>전제:</strong> RFC 8489의 base protocol과 사용하는 authentication·transport usage를 명시한다.</p>
            <p><strong>근거 범위:</strong> Binding request/response와 observed address semantics에 한정한다.</p>
            <p><strong>비보장:</strong> STUN 단독이 NAT traversal 성공, peer identity, relay나 고정 mapping lifetime을 보장하지 않는다.</p>
          </div>
        </CitationBlock>
      </section>

      <section id="turn" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">TURN: 직접 경로가 없을 때 relay allocation 사용하기</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Alice는 authenticated Allocate transaction으로 TURN server에 relayed
            transport address를 요청한다. Allocation은 client/server transport,
            relay address, authentication state, permission과 channel, expiry를
            가진 server-side state다. Default lifetime은 600초이며 data를 보내는
            것만으로 갱신되지 않으므로 만료 전에 Refresh가 필요하다.
          </p>
          <p>
            Bob의 IP에 CreatePermission 또는 ChannelBind를 성공시켜야 relay가
            Bob traffic을 Alice에게 넘긴다. Permission lifetime은 300초이고 port가
            아니라 peer IP를 기준으로 검사한다. TURN은 reachable fallback을
            제공하지만 direct path보다 반드시 정확히 “2배 RTT”가 되는 것은
            아니다. 실제 추가 지연과 server bandwidth는 topology와 transport로
            측정한다.
          </p>
        </div>

        <div className="not-prose my-8">
          <TURNViz />
        </div>

        <CitationBlock
          source="RFC 8656 — Traversal Using Relays around NAT"
          citeKey={2}
          href="https://www.rfc-editor.org/rfc/rfc8656.html"
        >
          <div id="paper-turn" className="space-y-1 text-sm leading-6">
            <p><strong>문제:</strong> Direct candidate가 실패해도 peer 사이에 reachable data path가 필요하다.</p>
            <p><strong>기여:</strong> TURN allocation, long-term authentication, permission, channel과 refresh lifecycle을 규정한다.</p>
            <p><strong>전제:</strong> RFC 8656과 RFC 8489, 선택한 client-server transport를 함께 적용한다.</p>
            <p><strong>근거 범위:</strong> Relay address와 allocation state machine, 기본 lifetime에 한정한다.</p>
            <p><strong>비보장:</strong> Relay가 낮은 latency, 무제한 bandwidth, application E2E identity·confidentiality를 보장하지 않는다.</p>
          </div>
        </CitationBlock>
      </section>

      <section id="ice" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">ICE: 후보를 정렬하고 실제 packet으로 검사하기</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Alice와 Bob은 host, server-reflexive, relayed candidate를 signaling으로
            교환하고 local×remote pair checklist를 만든다. Candidate type 이름만
            보고 경로가 통한다고 가정하지 않고 STUN connectivity check를 보낸다.
            Controlling agent가 성공한 valid pair를 USE-CANDIDATE로 nominate하면
            selected pair가 data path가 된다.
          </p>
          <p>
            Wi-Fi에서 mobile network로 바뀌어 selected pair가 실패하면 새
            candidate와 credential로 checklist를 다시 만들고 connectivity check를
            재개한다. 새 pair가 nominate될 때까지 relay path를 유지하고, migration
            deadline 안에 direct path가 없으면 relay를 계속 선택한다. 새 stream
            또는 application state를 옮기는 방식은 ICE가 아니라 상위 transport가
            소유한다.
          </p>
        </div>

        <ExplainedFormula
          question="ICE checklist에서 candidate pair의 검사 순서를 어떻게 정하는가?"
          idea="두 candidate 중 낮은 priority를 가장 큰 자리로 올려 약한 쪽을 먼저 비교하고, 높은 priority와 controlling role을 뒤의 tie-breaker로 붙인다."
          formula={String.raw`P_{pair}=2^{32}\min(G,D)+2\max(G,D)+\mathbf{1}[G>D]`}
          terms={[
            { symbol: "P_{pair}", name: "Pair priority", description: "Checklist 내림차순 정렬에 쓰는 64-bit 범위의 무차원 정수" },
            { symbol: "G", name: "Controlling priority", description: "Controlling agent가 제공한 candidate의 uint32 미만 priority" },
            { symbol: "D", name: "Controlled priority", description: "Controlled agent가 제공한 candidate의 uint32 미만 priority" },
            { symbol: "2^{32}", name: "Position factor", description: "작은 priority를 더 큰 정렬 자리로 이동시키는 무차원 계수" },
            { symbol: "\\mathbf{1}[G>D]", name: "Role tie-breaker", description: "G가 D보다 크면 1, 아니면 0인 indicator" },
          ]}
          assumptions={[
            "G와 D는 RFC 8445 candidate priority 규칙으로 계산된 2^32 미만 정수다.",
            "두 agent의 controlling/controlled role이 충돌 없이 정해져 있어야 한다.",
            "Priority는 검사 순서를 정할 뿐 connectivity success나 RTT를 계산하지 않는다.",
          ]}
          interpretation="Minimum priority가 큰 pair가 먼저 오고, 같으면 maximum과 role bit가 순서를 가른다. 높은 P_pair도 NAT·firewall 통과를 보장하지 않으므로 반드시 connectivity check 결과로 valid 여부를 정한다."
        />

        <div className="not-prose my-8">
          <ICEViz />
        </div>

        <CitationBlock
          source="RFC 8445 — Interactive Connectivity Establishment"
          citeKey={3}
          href="https://www.rfc-editor.org/rfc/rfc8445.html"
        >
          <div id="paper-ice" className="space-y-1 text-sm leading-6">
            <p><strong>문제:</strong> 여러 local·remote address 조합 중 실제 양방향 data path를 골라야 한다.</p>
            <p><strong>기여:</strong> Candidate gathering, checklist, paced STUN checks, nomination과 restart를 정의한다.</p>
            <p><strong>전제:</strong> RFC 8445 full ICE와 signaling·role·credential 교환이 정상 수행된다고 둔다.</p>
            <p><strong>근거 범위:</strong> Candidate-pair priority, connectivity check와 nomination semantics에 한정한다.</p>
            <p><strong>비보장:</strong> 높은 priority, STUN address 하나, 고정 timeout이 direct connectivity를 보장하지 않는다.</p>
          </div>
        </CitationBlock>
      </section>

      <section id="hole-punching" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Hole punching과 실패 뒤 relay 유지</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Alice와 Bob이 상대의 observed address로 비슷한 시점에 outbound packet을
            보내면 각 NAT에 mapping과 filtering state가 생겨 direct path가 열릴 수
            있다. 하지만 destination-dependent mapping, strict firewall, stale
            observation, packet loss가 있으면 실패한다. “Symmetric NAT면 항상
            불가능”이나 “±500 ms면 성공” 같은 보편 법칙 대신 attempt별 address,
            transport, timing과 outcome을 기록한다.
          </p>
        </div>

        <div className="not-prose my-8">
          <HolePunchViz />
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Libp2p DCUtR은 이미 Circuit Relay로 연결된 두 peer가 Connect message로
            observed/predicted address를 교환하고, Sync와 measured relay RTT의
            절반 timer로 simultaneous open을 맞추는 protocol이다. 한 direct
            connection이 성공하면 새 stream을 direct path에 우선 배치하고 relay는
            grace period 뒤 닫는다. 실패하면 relay를 유지하며 다음 retry마다
            Connect/Sync를 다시 해 잘못된 첫 RTT 측정을 계속 재사용하지 않는다.
          </p>
          <p>
            Release gate는 direct success rate 하나가 아니라 connection time,
            relay bytes, candidate별 reject reason, restart 후 path migration,
            application identity와 encryption parity를 함께 비교해야 한다.
          </p>
          <p>
            재현 가능한 receipt에는 RFC 8489·8656·8445와 DCUtR revision,
            client SHA·configuration, mapping/filtering fixture, candidate와
            timing을 고정한다. STUN transaction, TURN lifetime, ICE nomination,
            DCUtR retry의 outcome과 memory·packet 상한을 canary에서 비교하고
            identity/encryption parity가 깨지면 direct migration을 rollback한다.
          </p>
        </div>

        <CitationBlock
          source="libp2p Specification — Direct Connection Upgrade through Relay"
          citeKey={4}
          href="https://github.com/libp2p/specs/blob/master/relay/DCUtR.md"
        >
          <div id="paper-dcutr" className="space-y-1 text-sm leading-6">
            <p><strong>문제:</strong> Relay로 이미 연결된 두 NAT peer를 가능한 경우 direct path로 옮겨야 한다.</p>
            <p><strong>기여:</strong> Active revision r1의 Connect·Sync, RTT timer와 simultaneous TCP/QUIC dial을 규정한다.</p>
            <p><strong>전제:</strong> Circuit Relay connection, Identify observed addresses와 지원 transport가 존재한다.</p>
            <p><strong>근거 범위:</strong> DCUtR coordination, retry와 successful migration semantics에 한정한다.</p>
            <p><strong>비보장:</strong> 모든 NAT에서 hole punching 성공, application authentication, relay-free liveness를 보장하지 않는다.</p>
          </div>
        </CitationBlock>
      </section>
    </>
  );
}
