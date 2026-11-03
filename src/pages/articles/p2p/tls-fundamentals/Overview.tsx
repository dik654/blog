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
          <strong>
            TLS 1.3은 브라우저가 의도한 서버인지 확인하고, 둘만 아는 키를 만든
            뒤, 그 키로 이후 바이트를 읽기·변조로부터 보호하는 절차입니다.
          </strong>{" "}
          따라서 자물쇠 하나의 이름이 아니라 “누구와 어떤 조건으로 어떤 키를
          합의했는가”를 정하는 통신 규칙입니다.
        </p>
        <p>
          먼저 한 요청만 따라가 보겠습니다. 카페 Wi‑Fi에서 브라우저가
          <code>https://api.example/login</code>을 엽니다. 이 글의 사례는 이전
          접속 정보가 없는 새 연결이며, 브라우저가 X25519 공개값과
          <code>TLS_AES_128_GCM_SHA256</code>을 제안하고 서버가 그대로 고르는
          경로입니다. 재시도도, PSK도, 0‑RTT도 없습니다. 실제 패킷을 캡처한 값이
          아니라 각 단계의 책임을 고정하기 위한 대표 사례입니다.
        </p>
        <p>
          브라우저와 서버는 공개값을 주고받아 같은 비밀을 계산합니다. 브라우저는
          인증서에 적힌 이름이 자신이 입력한 <code>api.example</code>과 맞는지
          확인합니다. 이어서 지금까지 주고받은 내용 전체가 바뀌지 않았는지
          확인한 뒤에야 HTTP 요청을 보냅니다. 이 앞 절차를
          <strong> 핸드셰이크</strong>, 합의한 키로 실제 바이트를 보호하는 뒤
          절차를 <strong>레코드 프로토콜</strong>이라고 부릅니다.
        </p>
      </div>
      <ContentBoundary article="tls-fundamentals" />
      <div className="not-prose my-8">
        <TLSOverviewViz />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>먼저 관측 가능한 흐름을 잡습니다</h3>
        <p>
          이 사례에서는 ClientHello와 ServerHello의 협상 정보와 X25519 공개값이
          네트워크에 보입니다. 그 뒤의 EncryptedExtensions, Certificate,
          CertificateVerify, Finished는 핸드셰이크 키로 보호됩니다. 브라우저가
          인증서 경로·서비스 이름·서명·Finished를 모두 확인해야 “내가 요청한
          서버와 합의한 연결”이 됩니다. 인증서가 있다는 사실만으로는 부족합니다.
        </p>
        <p>
          이 전체 흐름에서 한 질문이 다음 질문을 낳습니다. 공개값만으로 같은
          비밀을 만들 수 있다면 중간자를 어떻게 막을까요? 인증서가 맞더라도 협상
          중 한 바이트가 바뀌지 않았다는 것은 어떻게 알까요? 하나의 비밀을
          양방향 모든 용도에 그대로 쓰지 않으려면 어떻게 나눌까요? 마지막으로
          같은 키로 여러 레코드를 보낼 때 nonce를 어떻게 겹치지 않게 할까요? 뒤
          절들은 이 네 질문을 같은 <code>api.example</code> 연결로 답합니다.
        </p>
        <p>
          여기서는 바이트가 순서와 길이를 가지고 직렬화된다는 최소 전제에서
          출발합니다. X25519의 수학은{" "}
          <Link to="/cs/crypto/diffie-hellman">Diffie–Hellman 정본</Link>에서 더
          깊게 다룹니다. 다음 글인{" "}
          <Link to="/cs/p2p/quic-fundamentals">QUIC</Link>은 이 핸드셰이크를 UDP
          위 패킷·손실 복구와 결합합니다.
        </p>
        <div
          id="paper-rfc9846"
          className="scroll-mt-24 border-l border-primary/50 pl-4"
        >
          <p className="text-xs font-bold text-primary">명세 읽기 · RFC 9846</p>
          <p>
            2026년 7월 발행된 RFC 9846은 RFC 8446을 대체한 현재 TLS 1.3
            규격입니다. 핸드셰이크, 레코드 보호, 키 스케줄, 0‑RTT의 경계를 함께
            정의합니다. 이 글의 메시지 순서와 보안 주장은 그 상태 기계에
            한정하며, 실제 지연 시간이나 특정 라이브러리 API까지 규격의 보장으로
            넓히지 않습니다.
          </p>
          <CitationBlock
            source="IETF RFC 9846 — The Transport Layer Security (TLS) Protocol Version 1.3"
            citeKey={1}
            href="https://www.rfc-editor.org/rfc/rfc9846.html"
          >
            기본 전체 핸드셰이크와 재시도·PSK 변형, AEAD 레코드 구조, HKDF 키
            스케줄과 KeyUpdate의 보안 경계를 확인합니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
