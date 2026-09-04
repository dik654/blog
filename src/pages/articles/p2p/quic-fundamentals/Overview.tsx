import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import QUICStackViz from "./viz/QUICStackViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        QUIC은 UDP를 그대로 쓰는 것이 아니라, 전송 상태를 userspace에서 다시
        설계합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          영상 통화 중 Wi‑Fi에서 이동통신으로 바뀌거나 한 HTTP response packet이 유실되는 상황을 생각해 봅시다. TCP 연결은 IP·port 4‑tuple과 하나의
          ordered byte stream에 묶입니다. QUIC은 connection identity, packet number, acknowledgment부터 loss recovery,
          congestion control, flow control과 여러 ordered stream까지를 UDP datagram 위 하나의 암호화된 transport로 묶습니다.
        </p>
        <p>
          UDP는 QUIC packet을 나르는 최소한의 demultiplexing·checksum 경계일 뿐 reliability를 제공하지 않습니다. QUIC endpoint가 ACK를
          해석하고 lost frame을 새 packet에 다시 실으며 congestion window와 receive credit을 지킵니다. QUIC의 이점은 “UDP라서 빠르다”로
          요약되지 않습니다. Handshake와 transport state를 함께 설계하고 kernel 배포 주기에서 분리할 수 있다는 점이 핵심입니다.
        </p>
        <p>
          이 글은 <Link to="/p2p/tls-fundamentals">TLS 1.3 정본</Link>의
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
          Sender는 stream bytes와 control frame을 QUIC packet에 넣고 packet number를 붙인 뒤 packet protection을 적용해 UDP
          datagram으로 보냅니다. Receiver는 packet을 인증·복호화하고 ACK range를 만들며 frame을 해당 stream offset에 배치합니다. Packet이
          유실되어도 같은 packet을 그대로 재전송하지는 않습니다. 아직 필요한 frame을 새로운 packet number에 실어 보냅니다.
        </p>
        <p>
          QUIC은 TCP의 transport-level head-of-line blocking을 stream 사이에서 제거하지만 같은 connection의 congestion
          controller와 connection-level flow-control budget은 공유합니다. 한 stream의 손실이 다른 stream bytes의 순서 전달을 막지는
          않아도 congestion window 감소로 전체 throughput이 줄 수 있습니다.
        </p>
        <div
          id="paper-rfc9000"
          className="scroll-mt-24 border-l border-primary/50 pl-4"
        >
          <p className="text-xs font-bold text-primary">명세 읽기 · RFC 9000</p>
          <p>
            RFC 9000은 QUIC transport에서 connection과 stream, packet과 migration의 계약을 정의합니다. Loss detection과
            congestion control의 구체적 기준은 RFC 9002가, TLS mapping과 packet protection은 RFC 9001이 소유합니다.
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
