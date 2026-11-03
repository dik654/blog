import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import { QuicFlowViz, QuicStackViz } from "./viz/ModernQuicViz";

export default function ModernLibp2pQuicArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            rust-libp2p v0.57.1 · libp2p-quic 0.14.0
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            QUIC은 보안과 여러 stream을 한 connection에 묶습니다
          </h2>
        </header>
        <p className="text-lg leading-8">
          한 문장으로 답하면, rust-libp2p QUIC은 Bob의 UDP 주소를 TLS로 인증된
          <code>(실제 PeerId, QUIC connection)</code>으로 바꾸고 그 안에 여러
          bidirectional stream을 여는 transport입니다. TCP 경로에서 따로 붙이던 Noise와
          Yamux가 필요 없다는 뜻이지, application protocol과 CID 검증까지 끝났다는 뜻은
          아닙니다.
        </p>
        <p>
          Alice는 provider record에서
          <code>/ip4/203.0.113.7/udp/4001/quic-v1/p2p/12D3KooWBob</code>을 얻었습니다.
          같은 사례를 주소 parse→UDP endpoint→TLS certificate identity→QUIC
          connection→payroll stream→CID A 검증까지 따라갑니다. UDP는 주소와 port 사이에
          datagram을 운반하고, QUIC이 그 위에 신뢰성·TLS·stream을 더합니다.
        </p>
        <p>
          TCP의 <a className="text-primary hover:underline" href="/cs/p2p/libp2p-tcp#overview">socket lifecycle</a>,
          Noise의 <a className="text-primary hover:underline" href="/cs/p2p/libp2p-noise#overview"> identity binding</a>,
          Yamux의 <a className="text-primary hover:underline" href="/cs/p2p/libp2p-yamux#overview"> substream 책임</a>을
          비교 대상으로 재사용합니다. ACK·loss·connection ID의 일반 이론은
          <a className="text-primary hover:underline" href="/cs/p2p/quic-fundamentals#overview"> QUIC 정본</a>이 소유합니다.
        </p>
        <QuicStackViz />
      </section>

      <section id="identity-stream" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · 인증된 connection과 stream</p>
          <h2 className="mt-2 text-2xl font-bold">
            Certificate가 증명한 실제 PeerId와 주소가 기대한 Bob을 구분해야 합니다
          </h2>
        </header>
        <p>
          Transport는 IP·UDP·<code>quic-v1</code>과 optional <code>/p2p/PeerId</code>를
          해석합니다. TLS handshake가 끝나면 certificate에서 실제 remote PeerId를 꺼내
          QUIC <code>Connection</code>과 함께 반환합니다.
        </p>
        <p>
          고정 source의 일반 dial branch는
          주소 suffix의 expected PeerId를 그 자리에서 hard-fail 비교하지 않습니다. 따라서
          상위 Swarm·dial orchestration이 “요청한 Bob”과 “관측한 PeerId”를 맞추는 완료
          조건을 소유해야 합니다.
        </p>
        <p>
          Connection의 outbound substream은 Quinn의 <code>open_bi()</code>, inbound는
          <code>accept_bi()</code>로 얻습니다. 하지만 stream open은 Bob의 payroll handler가
          요청을 수락했거나 block을 보냈다는 영수증이 아닙니다. 그 위에서 stream protocol을
          합의하고 request/response timeout을 지나 받은 bytes를 CID A로 검증해야 합니다.
        </p>
        <p>
          이 구현은 bidirectional stream만 쓰고 QUIC datagram과 unidirectional stream을
          끕니다. Connection migration도 꺼져 있습니다. “QUIC 표준이 migration을
          지원한다”와 “이 adapter에서 현재 쓸 수 있다”를 구분해야 하는 이유입니다.
        </p>

        <div id="paper-rust-libp2p-quic-transport-0571">
          <CitationBlock
            source="rust-libp2p v0.57.1 — quic transport.rs · connection/connecting.rs"
            citeKey={1}
            type="code"
            href="https://github.com/libp2p/rust-libp2p/tree/2fed78f/transports/quic/src"
          >
            <p><strong>문제:</strong> QUIC multiaddr를 authenticated libp2p peer connection으로 바꿉니다.</p>
            <p><strong>기여:</strong> Address parse, endpoint 선택, TLS certificate PeerId 추출과 transport output을 구현합니다.</p>
            <p><strong>전제:</strong> v0.57.1 config, 호환되는 libp2p TLS certificate와 상위 expected-peer 검사를 사용합니다.</p>
            <p><strong>근거 범위:</strong> Dial/listen setup, observed PeerId와 connection establishment입니다.</p>
            <p><strong>말하지 않는 것:</strong> Application authorization, content availability, payload integrity를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-rust-libp2p-quic-stream-0571">
          <CitationBlock
            source="rust-libp2p v0.57.1 — quic connection.rs · stream.rs"
            citeKey={2}
            type="code"
            href="https://github.com/libp2p/rust-libp2p/tree/2fed78f/transports/quic/src/connection"
          >
            <p><strong>문제:</strong> 한 QUIC connection 위에서 독립적인 libp2p byte streams를 제공합니다.</p>
            <p><strong>기여:</strong> Bidirectional stream open·accept, read/write, close와 connection-close mapping을 구현합니다.</p>
            <p><strong>전제:</strong> Handshake가 끝났고 stream·connection flow-control credit가 남아 있습니다.</p>
            <p><strong>근거 범위:</strong> Local StreamMuxer API와 Quinn stream lifecycle adapter입니다.</p>
            <p><strong>말하지 않는 것:</strong> Remote handler 처리, exactly-once request, durable acknowledgement를 제공하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="hole-punching" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · socket reuse와 hole punch</p>
          <h2 className="mt-2 text-2xl font-bold">
            Hole punch는 direct handshake 가능성을 높입니다
          </h2>
        </header>
        <p>
          일반 dial은 listener endpoint를 재사용하거나 address family별 dialer endpoint를
          만듭니다. 반면 Listener role의 hole-punch branch는 multiaddr의 PeerId와 재사용할
          active listener를 모두 요구합니다. 같은 remote address에 active attempt가 있으면
          두 번째 시도를 거부합니다.
        </p>
        <p>
          Source의 puncher는 64 random bytes를 UDP로 보내고 10~200ms 사이의 random delay 뒤
          반복합니다. Default handshake timeout은 5초입니다. 그 사이 matching inbound QUIC
          connection이 poll에 들어오면 attempt receiver로 넘기고, 먼저 timeout이 나면
          direct path가 실패합니다. 이것은 NAT mapping을 만들 기회이지 성공 보장이 아닙니다.
        </p>

        <AlgorithmBlock
          title="한 QUIC hole-punch attempt가 끝나는 실제 순서"
          input={[
            "role = Listener, remote = 203.0.113.7:4001",
            "multiaddr expected peer = Bob",
            "active listening UDP endpoint와 handshake timeout 5s",
          ]}
          steps={[
            {
              code: "require /p2p/PeerId and choose eligible listener",
              note: "Expected peer suffix나 재사용할 listener가 없으면 이 branch를 시작하지 않습니다.",
            },
            {
              code: "clone UDP socket; register attempt by remote SocketAddr",
              note: "같은 remote의 살아 있는 attempt는 HolePunchInProgress로 거부합니다.",
            },
            {
              code: "loop: send 64 random bytes; sleep random 10..200ms",
              note: "양쪽 NAT mapping을 열기 위한 packet이며 QUIC connection success 자체가 아닙니다.",
            },
            {
              code: "race matching inbound connection vs 5s punch timeout",
              note: "Transport poll이 같은 remote address의 inbound upgrade를 receiver로 전달합니다.",
            },
            {
              code: "return observed PeerId + Connection; upper layer checks target",
              note: "현재 hole-punch branch는 expected mismatch를 warning으로 남기고 실제 identity를 반환합니다.",
            },
          ]}
          output="Direct QUIC connection 또는 in-progress·listener·I/O·handshake-timeout 오류"
        />

        <p>
          Attempt receipt에는 local·remote address, socket reuse, expected·observed PeerId,
          timeout과 relay fallback reason을 남깁니다. Symmetric NAT나 UDP 차단 환경은 direct
          path가 열리지 않을 수 있으므로 bounded backoff 뒤 relay·다른 transport로 넘어갑니다.
        </p>
        <div id="paper-rust-libp2p-quic-holepunch-0571">
          <CitationBlock
            source="rust-libp2p v0.57.1 — quic transport.rs · hole_punching.rs"
            citeKey={3}
            type="code"
            href="https://github.com/libp2p/rust-libp2p/tree/2fed78f/transports/quic/src"
          >
            <p><strong>문제:</strong> NAT 뒤 peers가 기존 UDP mapping으로 direct QUIC handshake를 시도합니다.</p>
            <p><strong>기여:</strong> Eligible socket reuse, attempt dedup, randomized UDP punch와 timeout race를 구현합니다.</p>
            <p><strong>전제:</strong> 양쪽 address coordination, target PeerId와 재사용 가능한 listening endpoint가 있습니다.</p>
            <p><strong>근거 범위:</strong> 한 node의 simultaneous direct dial orchestration과 inbound matching입니다.</p>
            <p><strong>말하지 않는 것:</strong> 모든 NAT의 direct reachability나 relay 없는 liveness를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · flow control과 release</p>
          <h2 className="mt-2 text-2xl font-bold">
            지금 보낼 수 있는 양은 stream·connection·network 세 창 중 가장 작은 값입니다
          </h2>
        </header>
        <p>
          Stream credit가 남아도 connection 전체 credit가 소진되거나 congestion window가
          작으면 write가 진행되지 않습니다. 반대로 buffer만 키워도 Bob의 application이
          읽지 않으면 memory와 대기시간만 늘 수 있습니다.
        </p>
        <QuicFlowViz />
        <ExplainedFormula
          question="한 payroll stream이 지금 전송할 수 있는 in-flight byte의 상한은 무엇일까요?"
          idea={<>수신측 stream credit, connection 전체 credit, network budget을 동시에 지켜야 하므로 가장 작은 창이 현재 병목입니다.</>}
          formula={String.raw`W_{eff}=\min(S,C,N)`}
          annotatedFormula={String.raw`W_{eff}=\min(\underbrace{S}_{\text{stream}},\underbrace{C}_{\text{connection}},\underbrace{N}_{\text{network}})`}
          operations={[
            {
              expression: String.raw`\min(S,C,N)`,
              annotation: [
                "수신측 stream·connection credit과",
                "network budget을 동시에 지켜야 해 최솟값",
                "64·256·96 KiB면 stream 64 KiB가 병목",
              ],
            },
          ]}
          terms={[
            { symbol: "S", name: "stream credit", description: "이 stream에 receiver가 허용한 미소비 byte 범위입니다." },
            { symbol: "C", name: "connection credit", description: "모든 stream이 공유하는 connection-level flow-control 여유입니다." },
            { symbol: "N", name: "network budget", description: "ACK와 loss로 network에 둘 수 있다고 판단한 in-flight budget입니다." },
          ]}
          assumptions={[
            "세 값은 같은 시점의 byte 단위 available budget입니다.",
            "64/256/96 KiB는 계산 설명용이며 library default가 아닙니다.",
            "Application reader가 계속 consume하고 connection이 closing 상태가 아니라고 둡니다.",
          ]}
          interpretation="64 KiB, 256 KiB, 96 KiB 중 최솟값은 64 KiB입니다. 따라서 이 순간에는 stream credit가 병목이며, 이 값만으로 실제 처리량이나 완료시간을 알 수는 없습니다."
        />
        <p>
          고정 revision의 default는 handshake timeout 5초, idle timeout 10초, keepalive 5초,
          inbound bidirectional stream 256개, stream receive window 10,000,000 bytes,
          connection receive window 15,000,000 bytes입니다.
        </p>
        <p>
          이는 QUIC 표준값이 아니라 구현
          default이며 실제 workload에서 memory·p95·p99를 함께 측정합니다.
        </p>
        <p>
          Trace에는 endpoint 선택, handshake 완료, observed PeerId, stream open, protocol
          negotiation, first byte와 CID 검증 시각을 같은 request ID로 남깁니다. Cold dial과
          기존 connection의 warm stream을 섞지 않고, phase별 percentile과 end-to-end
          percentile을 각각 원 sample에서 계산합니다.
        </p>
        <p>
          Release test는 target PeerId mismatch, protocol negotiation failure, stream reset,
          connection close, flow-control stall, hole-punch timeout과 relay fallback을 분리합니다.
          검증되지 않은 partial block은 publish하지 않고 retry는 idempotent CID request에만
          bounded하게 적용합니다.
        </p>
      </section>
    </article>
  );
}
