import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import TLSOverviewViz from "./viz/TLSOverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        TLS 1.3은 암호 하나가 아니라, 안전한 채널을 합의하는 프로토콜입니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          카페 Wi‑Fi처럼 네트워크를 믿을 수 없는 곳에서도 서버의 응답을 읽고
          바꾸지 못하게 하려면, 양 끝점이 같은 키를 만들고 상대의 신원을 확인한
          뒤 모든 메시지를 그 합의에 묶어야 합니다. TLS(Transport Layer
          Security)는 이 전체 절차를 담당합니다. 핵심은 “암호화했다”가 아니라
          <strong> 누구와 어떤 조건으로 어떤 키를 합의했는지</strong>입니다.
        </p>
        <p>
          TLS 1.3은 두 책임으로 나뉩니다. Handshake protocol은 version과 cipher suite, key share를 협상하고 서버를 인증해 traffic
          secret을 만듭니다. Record protocol은 그 secret에서 만든 방향별 key와 nonce로 application bytes를 보호합니다. Handshake가
          실패하면 record layer가 대신 신뢰를 만들어 주지 못합니다. 반대로 인증서를 확인했더라도 record nonce를 재사용하면 데이터 보호가 깨질 수 있습니다.
        </p>
        <p>
          여기서는 byte가 직렬화된다는 최소 전제에서 출발합니다. ECDHE의 군 연산
          자체는 <Link to="/crypto/diffie-hellman">Diffie–Hellman 정본</Link>
          에서 더 깊게 다루고, 이 글은 그 shared secret이
          transcript·certificate·HKDF와 어떻게 결합되는지 소유합니다. 다음 글인{" "}
          <Link to="/p2p/quic-fundamentals">QUIC</Link>은 이 TLS handshake를 UDP
          위 packet·loss recovery와 결합합니다.
        </p>
      </div>
      <ContentBoundary article="tls-fundamentals" />
      <div className="not-prose my-8">
        <TLSOverviewViz />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>먼저 관측 가능한 흐름을 잡습니다</h3>
        <p>
          ClientHello와 ServerHello까지는 협상과 key share가 보입니다. 이후 EncryptedExtensions와 Certificate,
          CertificateVerify, Finished는 handshake traffic key로 보호됩니다. Client가 서버의 certificate chain과 signature,
          Finished를 모두 검증한 뒤에야 “이 서버와 합의한 transcript”에 연결된 channel이 됩니다. TLS는 server identity 정책이나 hostname을
          스스로 정하지 않습니다. 어떤 이름을 인증서와 비교할지는 상위 protocol의 몫입니다.
        </p>
        <p>
          TLS 1.3의 full handshake는 보통 1‑RTT에 application key를 만듭니다. HelloRetryRequest가 필요하거나 network loss가 나면
          더 오래 걸립니다. 0‑RTT가 말하는 것은 이전 PSK를 이용해 첫 flight에 early data를 보낼 수 있다는 범위까지입니다. 응답까지 0시간이 되거나 replay
          protection이 생기지는 않습니다.
        </p>
        <div
          id="paper-rfc8446"
          className="scroll-mt-24 border-l border-primary/50 pl-4"
        >
          <p className="text-xs font-bold text-primary">명세 읽기 · RFC 8446</p>
          <p>
            RFC 8446은 TLS 1.3의 handshake와 record protection, HKDF key schedule, 0‑RTT anti-replay 경계를 함께
            정의합니다. 이 글의 메시지 순서와 보안 주장은 해당 상태 기계에 한정합니다. 특정 library의 API나 모든 application의 hostname 정책까지 표준이
            정한다고 일반화하지는 않습니다.
          </p>
          <CitationBlock
            source="IETF RFC 8446 — The Transport Layer Security (TLS) Protocol Version 1.3"
            citeKey={1}
            href="https://www.rfc-editor.org/rfc/rfc8446.html"
          >
            Handshake가 인증·협상·keying material을 만들고 record protocol이
            이를 사용해 각 record를 보호한다는 두 책임을 확인합니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
