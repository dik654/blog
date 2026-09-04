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
          주소를 알아낸 두 peer가 연결 한 건을 만든다고 해봅시다. 실제
          application message를 보내기 전에는 연결 방법을 고르고, 상대 identity를
          인증하고, 한 연결을 여러 protocol stream으로 나눈 뒤, 각 event를 올바른
          protocol state에 전달해야 합니다. libp2p는 이 책임을 하나의 거대한
          protocol에 넣지 않고 <strong>Transport → Security → Stream multiplexer →
          Swarm → NetworkBehaviour</strong> 경계로 조립합니다.
        </p>
        <p>
          이 글은 rust-libp2p의 한 outbound connection을 끝까지 추적합니다.
          Transport가 <em>어떻게 연결할지</em>, ConnectionHandler가 <em>그 연결에서
          어떤 protocol stream을 열지</em>, NetworkBehaviour가 <em>어느 peer와 무엇을
          할지</em>를 나눠 보는 것이 핵심입니다. 이름을 외우는 대신 각 state의
          owner와 실패가 어디로 돌아오는지를 확인합니다.
        </p>
        <p>
          암호 채널 자체는 <Link to="/p2p/tls-fundamentals">TLS 1.3 정본</Link>,
          내장형 secure transport는 <Link to="/p2p/quic-fundamentals">QUIC 정본</Link>,
          받은 block의 byte integrity는 <Link to="/p2p/content-addressing">content
          addressing 정본</Link>이 소유합니다. 여기서는 그 기능을 다시 정의하지 않고
          libp2p stack의 어느 경계에 꽂히는지만 다룹니다.
        </p>
      </div>
      <ContentBoundary article="libp2p" />
      <ConnectionTraceViz kind="stack" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>먼저 output type을 따라갑니다</h3>
        <p>
          TCP Transport의 첫 output은 peer identity가 없는 <code>TcpStream</code>입니다.
          Noise upgrade가 성공하면 remote <code>PeerId</code>와 암호화된 I/O가 생기고,
          Yamux 같은 multiplexer가 올라가면 여러 bidirectional substream을 열 수 있는
          <code>StreamMuxerBox</code>가 됩니다. Swarm이 받는
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
            source="libp2p Specifications — Connection Establishment"
            citeKey={1}
            href="https://github.com/libp2p/specs/tree/master/connections"
          >
            Transport upgrade, secure channel, stream multiplexer와 protocol negotiation이
            연결 수립 과정에서 맡는 역할을 확인합니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
