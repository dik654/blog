import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import QUICStackViz from "./viz/QUICStackViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        QUIC은 UDP 위에 전송 규칙을 다시 세웁니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          <strong>
            QUIC은 UDP가 하지 않는 도착 확인·손실 복구·혼잡 조절·여러 스트림과
            TLS 보호를 사용자 공간에서 한 연결로 관리하는 전송 프로토콜입니다.
          </strong>{" "}
          그래서 “UDP라서 빠르다”가 아니라, 핸드셰이크와 전송 상태를 함께
          설계했다는 데 의미가 있습니다.
        </p>
        <p>
          한 모바일 앱이 카페 Wi‑Fi에서 <code>api.example</code>에 처음
          연결한다고 하겠습니다. 이전 접속 정보는 없고 0‑RTT도 쓰지 않습니다.
          연결 뒤 앱은 양방향 스트림 0에서 대화 텍스트를, 스트림 4에서 미리보기
          데이터를 받습니다. 스트림 0의 offset 100–199를 담은 packet 18은
          유실되고, 필요한 바이트는 새 packet 25에 다시 실립니다. 이어서 전화가
          Wi‑Fi에서 LTE로 바뀝니다. 뒤 절은 이 한 연결을 계속 사용합니다.
        </p>
        <p>
          UDP가 제공하는 것은 IP·port로 datagram을 전달하고 checksum을 확인하는
          바닥뿐입니다. QUIC endpoint가 packet number와 ACK를 해석하고, 아직
          필요한 frame을 새 packet에 넣으며, congestion window와 receive
          credit을 관리합니다. 같은 frame 바이트가 다시 보내져도 packet number는
          새로 붙습니다.
        </p>
        <p>
          이 글은 <Link to="/cs/p2p/tls-fundamentals">TLS 1.3 정본</Link>의
          handshake·AEAD·key schedule을 재사용합니다. QUIC에서 새로 볼 대상은
          TLS bytes가 CRYPTO frame과 packet-number space로 운반되는 방식,
          stream별 recovery, connection ID와 path validation입니다. HTTP/3이나
          libp2p application protocol은 이 transport 위의 별도 계약입니다.
        </p>
      </div>
      <ContentBoundary article="quic-fundamentals" />
      <div className="not-prose my-8">
        <QUICStackViz />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>한 packet을 관측하면 책임이 보입니다</h3>
        <p>
          Sender는 스트림 0의 offset 100–199를 STREAM frame에 넣고 packet number
          18을 붙입니다. Packet protection을 적용한 뒤 UDP datagram으로
          보냅니다. Receiver는 packet을 인증·복호화하고 ACK range를 만들며
          frame을 해당 stream offset에 배치합니다.
        </p>
        <p>
          Packet 18이 유실되면 같은 암호문이나 같은 packet number를 다시 보내지
          않습니다. Sender는 ACK와 timer로 손실을 판단하고, 여전히 필요한 STREAM
          frame 바이트를 새 packet 25에 넣습니다. 따라서 “packet 재전송”보다
          “frame 정보를 새 packet으로 다시 전송”이 정확합니다.
        </p>
        <p>
          스트림 0의 빈 구간은 스트림 0만 기다리게 합니다. 스트림 4의 연속된
          바이트는 먼저 application에 전달할 수 있습니다. 다만 두 스트림은 같은
          congestion controller와 connection-level flow-control budget을
          공유하므로, 손실 뒤 congestion window가 줄면 전체 처리량은 함께 줄 수
          있습니다.
        </p>
        <div
          id="paper-rfc9000"
          className="scroll-mt-24 border-l border-primary/50 pl-4"
        >
          <p className="text-xs font-bold text-primary">명세 읽기 · RFC 9000</p>
          <p>
            RFC 9000은 QUIC transport에서 connection과 stream, packet과
            migration의 계약을 정의합니다. Loss detection과 congestion control의
            구체적 기준은 RFC 9002가, TLS mapping과 packet protection은 RFC
            9001이 소유합니다.
          </p>
          <CitationBlock
            source="IETF RFC 9000 — QUIC: A UDP-Based Multiplexed and Secure Transport"
            citeKey={1}
            href="https://www.rfc-editor.org/rfc/rfc9000.html"
          >
            UDP 위 multiplexed stream, connection ID, packet/frame과 transport
            state의 normative 경계를 확인합니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
