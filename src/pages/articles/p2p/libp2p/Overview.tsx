import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ConnectionTraceViz from "./viz/ConnectionTraceViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        libp2p는 protocol 하나가 아니라, 교체 가능한 P2P network stack입니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          <strong>
            libp2p는 하나의 통신 protocol이 아니라, 주소에서 인증된 protocol
            stream까지 만드는 부품과 상태 소유권을 조립하는 규칙입니다.
          </strong>{" "}
          연결·인증·다중화·application protocol을 한 객체가 모두 맡지 않기 때문에
          TCP를 QUIC으로 바꾸거나 Ping 옆에 Kademlia를 추가해도 각 책임의 경계를
          유지할 수 있습니다.
        </p>
        <p>
          이 글에서는 Alice가 Bob에게 Ping 하나를 보내는 고정 사례만 따라갑니다.
          Bob의 주소는
          <code>/ip4/203.0.113.7/tcp/4001/p2p/12D3KooWBob</code>이고, Alice는 TCP
          위에서 Noise와 Yamux를 협상합니다. Swarm에 등록된 연결 ID는
          <code>42</code>, Ping nonce는 <code>7</code>, substream protocol은
          <code>/ipfs/ping/1.0.0</code>이라고 두겠습니다.
        </p>
        <p>
          이 사례에서 Transport는 <em>어떻게 연결할지</em>, ConnectionHandler는
          <em>연결 42에서 어떤 stream을 열지</em>, NetworkBehaviour는
          <em>어느 peer와 무엇을 할지</em>를 소유합니다. Swarm은 이 셋의 command와
          event를 전달합니다. 이름을 먼저 외우지 않고 nonce 7이 내려갔다가 Ping
          결과로 돌아오는 길을 본 뒤 이름을 붙입니다.
        </p>
        <p>
          암호 채널 자체는 <Link to="/cs/p2p/tls-fundamentals">TLS 1.3 정본</Link>,
          내장형 secure transport는 <Link to="/cs/p2p/quic-fundamentals">QUIC 정본</Link>,
          받은 block의 byte integrity는 <Link to="/cs/p2p/content-addressing">content
          addressing 정본</Link>이 소유합니다. 여기서는 그 기능을 다시 정의하지 않고
          libp2p stack의 어느 경계에 꽂히는지만 다룹니다.
        </p>
      </div>
      <ContentBoundary article="libp2p" />
      <ConnectionTraceViz kind="stack" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>먼저 output type을 따라갑니다</h3>
        <p>
          Base TCP transport의 output은 peer identity가 없는 <code>TcpStream</code>입니다.
          Noise upgrade가 성공하면 remote <code>PeerId</code>와 암호화된 I/O가 생기고,
          Yamux 같은 multiplexer가 올라가면 여러 bidirectional substream을 열 수 있는
          <code>StreamMuxerBox</code>가 됩니다.
        </p>
        <p>
          Swarm이 받는
          <code>(PeerId, StreamMuxerBox)</code>는 이 앞 단계가 모두 끝났다는 계약이지,
          Kademlia나 GossipSub가 이미 실행됐다는 뜻은 아닙니다.
        </p>
        <p>
          QUIC은 TLS 기반 인증과 stream multiplexing을 transport 내부에서 제공하므로
          외부 upgrade 조립 위치가 다릅니다. 그러나 Swarm 위에서는 두 경로 모두
          authenticated peer connection과 substream이라는 공통 형태로 정규화됩니다.
          이 추상화 덕분에 application protocol은 TCP socket option이나 QUIC packet
          number를 직접 소유하지 않습니다.
        </p>
        <div id="paper-libp2p-connections" className="scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">명세 읽기 · libp2p connection establishment</p>
          <p>
            Connection specification은 raw transport 위에서 security protocol과 stream multiplexer를 협상하는 bootstrap
            경로와 이후 각 substream에서 application protocol을 고르는 경로를 구분합니다. 구현마다 API 이름은 달라도 interoperable wire
            negotiation과 output 책임은 이 경계로 읽어야 합니다.
          </p>
          <CitationBlock
            source="libp2p Specifications commit c750236 — Connection Establishment"
            citeKey={1}
            href="https://github.com/libp2p/specs/tree/c750236de43cd8b246a824b377dfdb26bae686db/connections"
          >
            Transport upgrade, secure channel, stream multiplexer와 protocol negotiation이
            연결 수립 과정에서 맡는 역할을 확인합니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
