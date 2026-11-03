import { Link } from "react-router-dom";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { IrohBoundaryViz, IrohPathViz } from "./viz/ModernIrohViz";

export default function ModernIrohArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">Iroh v1.4.1 구현 읽기</p>
          <h2 className="text-3xl font-bold tracking-tight">
            Iroh는 원하는 내용을 찾아 주는 도구가 아니라, 찾은 상대와 인증된 연결을 만드는 도구입니다
          </h2>
        </header>
        <p className="text-lg leading-8">
          한 문장으로 답하면, Iroh는 상대의 공개키와 주소 후보를 받아 direct 또는 relay 경로로
          QUIC 연결을 만들고, ALPN으로 그 연결을 처리할 애플리케이션 프로토콜을 고릅니다.
          어떤 파일을 받을지, 상대가 그 파일을 가진 사람인지 찾는 일, 받은 byte가 맞는지
          검사하는 일은 그 앞뒤의 애플리케이션이 맡습니다.
        </p>
        <p>
          Alice가 Bob에게서 급여 보고서를 받는 고정 사례를 따라가겠습니다. Alice의
          애플리케이션은 기대 hash <code>H</code>와 Bob의 <code>EndpointId</code>를 이미
          알고 있습니다. Iroh는 Bob의 주소 후보로 연결을 시도하고
          <code>/payroll/cid-fetch/1</code> ALPN을 합의합니다. 그 뒤 handler가 Alice의 권한을
          확인해 byte를 보내고, Alice가 <code>hash(received) = H</code>를 확인해야 비로소
          보고서를 공개합니다.
        </p>
        <p>
          그래서 연결 성공만 보고 “올바른 보고서를 받았다”고 말할 수 없습니다. Iroh가 주는
          영수증은 <strong>Bob의 endpoint key와 합의한 프로토콜로 통신했다</strong>는
          사실이고, payload 승인 영수증은 애플리케이션의 hash·권한 검사에서 따로 나옵니다.
        </p>
        <IrohBoundaryViz />
        <aside className="border-l-2 border-primary bg-primary/5 px-5 py-4 text-sm leading-6">
          <strong>먼저 기억할 경계:</strong> hash·provider 찾기 → EndpointAddr 준비는
          애플리케이션, EndpointAddr → 인증된 QUIC와 ALPN 합의는 Iroh, 요청 권한과 받은 byte
          검증은 다시 애플리케이션 책임입니다.
        </aside>
      </section>

      <section id="endpoint-alpn" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · 신원·경로·프로토콜은 서로 다른 정보</p>
          <h2 className="mt-2 text-2xl font-bold">
            EndpointAddr는 누구에게 갈지와 어디로 시도할지를 묶고, ALPN은 도착 뒤 처리기를 고릅니다
          </h2>
        </header>
        <p>
          <code>EndpointAddr</code>의 <code>id</code>는 Bob을 가리키는 공개키이고,
          <code>addrs</code>는 relay·IP·custom transport 주소의 집합입니다. 주소가 비어 있어도
          설정된 <code>AddressLookup</code>이 ID를 주소로 풀어 줄 수 있습니다. 반대로 주소도
          없고 lookup도 결과를 못 내면 연결은 실패합니다. 주소는 신원을 대신하지 않고,
          신원도 네트워크 경로를 자동으로 만들어 내지 않습니다.
        </p>
        <p>
          <code>connect_with_opts</code>는 self-connect와 빈 ALPN을 거절하고, 주소를 remote
          map에 해석한 뒤 endpoint ID를 TLS server name으로 넣어 QUIC 연결 시도를
          시작합니다. 반환값은 아직 완성된 <code>Connection</code>이 아니라
          <code>Connecting</code>입니다. 이를 기다려 handshake가 끝나야 인증된
          <code>Connection</code>을 얻습니다. 일반 <code>connect</code>는 이 두 단계를 이어서
          수행합니다.
        </p>
        <p>
          서버의 <code>Router</code>는 합의된 ALPN과 등록된 <code>ProtocolHandler</code>를
          연결합니다. 그러나 ALPN은 “이 문법을 사용한다”는 선택이지 사용자 권한이 아닙니다.
          급여 handler는 요청자, 허용 hash, 응답 크기를 다시 검사해야 합니다. 재전송될 수
          있는 0-RTT에는 급여 공개 같은 비멱등 동작을 그대로 넣지 않는 경계도 필요합니다.
        </p>
        <AlgorithmBlock
          title="급여 보고서 hash 하나를 받는 전체 경로"
          input={[
            "expected_hash = H, remote_id = Bob의 EndpointId",
            "endpoint_addr = { id: remote_id, addrs: direct·relay 후보 }",
            "alpn = /payroll/cid-fetch/1",
          ]}
          steps={[
            { code: "if alpn is empty or remote_id == local_id: reject", note: "Iroh의 연결 전 입력 경계입니다." },
            { code: "resolve_remote(endpoint_addr); if no usable path, ask configured AddressLookup", note: "Lookup은 경로 후보를 보탤 뿐 payload 존재를 증명하지 않습니다." },
            { code: "connecting ← QUIC_CONNECT(path, tls_name=remote_id, alpn)", note: "여기서는 연결 시도를 시작했을 뿐입니다." },
            { code: "connection ← await connecting", note: "TLS endpoint identity와 ALPN handshake가 끝나야 합니다." },
            { code: "handler ← router.handler(connection.alpn); authorize(requester, H)", note: "등록되지 않은 ALPN과 권한 없는 요청은 닫습니다." },
            { code: "bytes ← handler.fetch(H); if hash(bytes) != H: reject", note: "전송 신뢰와 내용 무결성을 마지막에 분리해 확인합니다." },
            { code: "publish(bytes); record path, endpoint_id, alpn, payload_hash", note: "서로 다른 경계의 영수증을 한 로그에 남깁니다." },
          ]}
          output="Bob과 인증된 연결 + 권한과 hash를 통과한 보고서 byte"
        />
        <div id="paper-iroh-endpoint-v141">
          <CitationBlock
            source="iroh v1.4.1 · endpoint.rs · endpoint_addr.rs · protocol.rs · d6c6963"
            citeKey={1}
            type="code"
            href="https://github.com/n0-computer/iroh/tree/v1.4.1/iroh/src"
          >
            <p><strong>문제:</strong> endpoint 공개키, 여러 transport 주소와 애플리케이션 프로토콜을 한 연결 시도에 결합합니다.</p>
            <p><strong>기여:</strong> EndpointAddr, AddressLookup, Connecting/Connection 경계, TLS identity와 ALPN handler routing을 제공합니다.</p>
            <p><strong>전제:</strong> 2026-10-21 태그 v1.4.1과 기본 endpoint runtime을 기준으로 읽습니다.</p>
            <p><strong>근거 범위:</strong> 주소 해석, authenticated QUIC connection setup과 protocol dispatch입니다.</p>
            <p><strong>말하지 않는 것:</strong> content provider 발견, payload authorization, byte hash나 durable delivery를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="path-selection" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · 왜 가장 짧은 RTT만 고르지 않는가</p>
          <h2 className="mt-2 text-2xl font-bold">
            기본 selector는 direct를 우선하고, 같은 tier의 작은 RTT 흔들림에는 움직이지 않습니다
          </h2>
        </header>
        <p>
          기본 <code>BiasedRttPathSelector</code>는 IPv4·IPv6·custom transport를 primary,
          relay를 backup으로 둡니다. 먼저 tier를 비교하므로 direct가 하나라도 쓸 수 있게
          되면 더 짧은 relay RTT보다 direct를 택합니다. relay를 장애 시 연결을 이어 주는
          안전망으로 두려는 정책입니다.
        </p>
        <p>
          같은 primary끼리는 측정 RTT를 비교하되 IPv6에 3 ms 이점을 주고, 후보가 현재
          경로보다 5 ms 이상 좋아야 바꿉니다. RTT가 1~2 ms 흔들릴 때마다 연결 경로가
          오가는 flapping을 막기 위한 stickiness입니다. 이 수치는 v1.4.1 기본 구현값이지
          모든 망의 보편적 최적값은 아닙니다.
        </p>
        <IrohPathViz />
        <ExplainedFormula
          question="현재 path를 유지할지 후보로 바꿀지 어떻게 판단할까요?"
          idea="먼저 transport tier를 비교합니다. 같은 tier일 때만 bias를 적용한 RTT가 최소 5 ms 더 좋은지 봅니다."
          formula={String.raw`K(x)=(T_x,r_x+b_x),\quad \mathrm{switch}\iff T_c<T_o\;\lor\;(T_c=T_o\land r_c+b_c+5\mathrm{ms}\le r_o+b_o)`}
          annotatedFormula={String.raw`K(x)=(\underbrace{T_x}_{\text{transport tier}},\underbrace{r_x+b_x}_{\text{bias 보정 RTT}}),\quad \mathrm{switch}\iff \underbrace{T_c<T_o}_{\text{더 우선인 tier}}\;\lor\;\underbrace{(T_c=T_o\land r_c+b_c+5\mathrm{ms}\le r_o+b_o)}_{\text{같은 tier에서 5 ms 이상 이득}}`}
          operations={[
            { expression: String.raw`r_x+b_x`, annotation: ["측정 RTT에 transport bias를 더합니다.", "IPv6 21 ms는 −3 ms를 적용해 18 ms입니다."] },
            { expression: String.raw`T_c<T_o`, annotation: ["primary 후보와 backup 현재 경로처럼 tier가 다르면", "RTT 문턱 없이 더 우선인 tier로 바꿉니다."] },
            { expression: String.raw`r_c+b_c+5\mathrm{ms}\le r_o+b_o`, annotation: ["같은 tier에서는 5 ms 이상 좋아야 바꿉니다.", "18+5≤20은 거짓, 11+5≤20은 참입니다."] },
          ]}
          terms={[
            { symbol: "T_x", name: "transport tier", description: "primary가 backup보다 먼저 정렬됩니다." },
            { symbol: "r_x", name: "측정 RTT", description: "path x에서 읽은 round-trip time입니다." },
            { symbol: "b_x", name: "RTT bias", description: "기본값에서 IPv6는 −3 ms, IPv4·relay는 0입니다." },
            { symbol: "5\\mathrm{ms}", name: "전환 문턱", description: "같은 tier의 작은 jitter 때문에 경로가 계속 바뀌지 않게 합니다." },
          ]}
          assumptions={[
            "Iroh v1.4.1 기본 BiasedRttPathSelector의 ordering과 상수를 설명합니다.",
            "Selector가 읽을 수 있는 usable path stats가 있다고 가정합니다.",
            "custom selector와 이후 버전에는 같은 상수를 자동으로 적용하지 않습니다.",
          ]}
          interpretation="relay만 있을 때는 12 ms relay를 쓰고, IPv4 20 ms가 열리면 primary라 즉시 바꿉니다. IPv6 21 ms는 보정 뒤 18 ms지만 2 ms 이득뿐이라 유지하고, 14 ms가 되면 보정 뒤 11 ms라 IPv6로 전환합니다."
        />
        <CalculationWalkthrough
          title="relay에서 IPv4, 다시 IPv6로 가는 선택 장부"
          question="왜 12 ms relay보다 20 ms direct를 고르고, 18 ms 후보에는 움직이지 않을까요?"
          scope="v1.4.1 기본 selector, relay=backup, IP=primary, IPv6 bias −3 ms, same-tier 문턱 5 ms입니다."
          steps={[
            { label: "처음에는 relay만 열려 있습니다", expression: "usable = {relay 12 ms}", result: "relay 선택", reason: "backup이어도 primary 후보가 없으므로 연결을 이어 갑니다." },
            { label: "IPv4 direct가 열립니다", expression: "primary IPv4 vs backup relay", result: "IPv4 20 ms 선택", reason: "tier가 달라지면 RTT 12와 20을 직접 겨루지 않고 primary로 즉시 전환합니다." },
            { label: "IPv6 21 ms의 보정 RTT를 구합니다", expression: "21 − 3 = 18 ms", result: "후보 18 ms", reason: "IPv6 기본 이점을 측정 RTT에 적용합니다." },
            { label: "같은 tier의 5 ms 문턱을 검사합니다", expression: "18 + 5 ≤ 20 → 거짓", result: "IPv4 유지", reason: "2 ms 이득은 jitter일 수 있어 기존 path를 유지합니다." },
            { label: "IPv6가 14 ms로 좋아진 경우를 다시 검사합니다", expression: "(14 − 3) + 5 ≤ 20 → 16 ≤ 20", result: "IPv6로 전환", reason: "보정 뒤 9 ms 이득이므로 stickiness 문턱을 넘습니다." },
          ]}
          conclusion="기본 selector의 목표는 순간 최저 RTT 하나가 아니라 direct 우선과 안정적인 same-tier 전환입니다."
          caveats={[
            "Relay 비용·privacy·quota와 애플리케이션 완료시간은 이 selector 식에 직접 들어가지 않습니다.",
            "실제 네트워크에서는 path가 사라지거나 stats를 읽지 못해 best available 후보로 다시 선택할 수 있습니다.",
          ]}
        />
        <div id="paper-iroh-path-v141">
          <CitationBlock
            source="iroh v1.4.1 · biased_rtt_path_selector.rs · d6c6963"
            citeKey={2}
            type="code"
            href="https://github.com/n0-computer/iroh/blob/v1.4.1/iroh/src/socket/biased_rtt_path_selector.rs"
          >
            <p><strong>문제:</strong> direct·custom·relay 후보 사이에서 안정적인 현재 경로를 선택합니다.</p>
            <p><strong>기여:</strong> primary/backup tier, IPv6 −3 ms bias와 same-tier 5 ms hysteresis를 구현합니다.</p>
            <p><strong>전제:</strong> v1.4.1 기본 selector와 읽을 수 있는 path RTT stats를 사용합니다.</p>
            <p><strong>근거 범위:</strong> 한 remote endpoint에 대한 node-local path ordering과 전환 판단입니다.</p>
            <p><strong>말하지 않는 것:</strong> 최저 애플리케이션 완료시간, 최저 relay 비용, 모든 NAT 환경의 direct 성공을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · 실패도 경계별로 기록</p>
          <h2 className="mt-2 text-2xl font-bold">
            연결 실패, 프로토콜 거절, payload 불일치를 한 번의 “다운로드 실패”로 뭉치지 않습니다
          </h2>
        </header>
        <p>
          현재 source의 local path 상태는 <code>Open</code>·<code>Inactive</code>·
          <code>Unusable</code>·<code>Unknown</code>입니다. 열렸던 path가 사라지면 Inactive,
          hole punching을 시도했지만 한 번도 쓸 수 없었다면 Unusable이 됩니다. 오래된 inactive와
          unusable non-relay path는 제한된 장부를 유지하도록 pruning 대상이 될 수 있습니다.
        </p>
        <p>
          그러나 endpoint ID mismatch나 지원하지 않는 ALPN은 “다른 IP로 재시도하면 될
          일”이 아닙니다. 상대 신원이나 프로토콜 계약이 틀렸으므로 fail closed 해야 합니다.
          반대로 stream reset은 연결·애플리케이션 경계를 나눠 재시도 여부를 정하고, 받은
          byte의 hash mismatch는 그 artifact를 publish하지 않는 payload 실패로 남깁니다.
        </p>
        <p>
          Release test는 direct 성공, relay fallback, same-tier flapping, address lookup 실패,
          endpoint ID mismatch, unknown ALPN, stream reset, hash mismatch를 따로 재현해야 합니다.
          각 receipt에는 selected path와 tier, remote endpoint ID, negotiated ALPN, 마지막 오류,
          payload hash 판정을 남겨야 어느 경계가 무너졌는지 추적할 수 있습니다.
        </p>
        <div id="paper-iroh-path-state-v141">
          <CitationBlock
            source="iroh v1.4.1 · path_state.rs · protocol.rs · d6c6963"
            citeKey={3}
            type="code"
            href="https://github.com/n0-computer/iroh/blob/v1.4.1/iroh/src/socket/remote_map/remote_state/path_state.rs"
          >
            <p><strong>문제:</strong> 변하는 network path와 protocol handler lifecycle을 제한된 state로 관리합니다.</p>
            <p><strong>기여:</strong> Open/Inactive/Unusable/Unknown 상태, path pruning과 ALPN handler lifecycle을 구현합니다.</p>
            <p><strong>전제:</strong> v1.4.1 endpoint runtime이 path event와 connection lifecycle을 계속 처리합니다.</p>
            <p><strong>근거 범위:</strong> node-local path 실패·교체와 handler dispatch cleanup입니다.</p>
            <p><strong>말하지 않는 것:</strong> remote content 존재, hash의 업무 의미, 애플리케이션 transaction commit을 증명하지 않습니다.</p>
          </CitationBlock>
        </div>
        <h3 className="text-xl font-semibold">다음 질문을 스스로 답할 수 있어야 합니다</h3>
        <p>
          주소가 없을 때 누가 보태는가, <code>Connecting</code>과 <code>Connection</code>은 왜
          다른가, ALPN 일치가 권한을 뜻하지 않는 이유, 12 ms relay보다 20 ms direct를
          고르는 이유, IPv6 21 ms에는 머물고 14 ms에는 바꾸는 이유를 같은 사례로 설명할 수
          있어야 합니다. Provider 발견이 궁금하면 <Link to="/cs/p2p/kademlia">Kademlia</Link>,
          content hash가 byte를 고정하는 원리는 <Link to="/cs/p2p/content-addressing">콘텐츠 주소화</Link>를
          먼저 읽습니다.
        </p>
      </section>
    </article>
  );
}
