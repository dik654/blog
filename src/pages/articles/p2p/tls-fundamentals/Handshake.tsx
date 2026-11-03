import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import TLSHandshakeViz from "./viz/TLSHandshakeViz";

export default function Handshake() {
  return (
    <section id="handshake" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        핸드셰이크는 세 가지를 한 합의로 묶습니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          사례의 브라우저는 ClientHello에 TLS 1.3, AES‑128‑GCM/SHA‑256, X25519
          공개값과 받아들일 서명 알고리즘을 넣습니다. 서버는 ServerHello에서 이
          조합을 선택하고 자기 X25519 공개값을 보냅니다. 두 끝점은 같은 shared
          secret을 계산합니다.
        </p>
        <p>
          하지만 이것만으로 상대가 진짜
          <code>api.example</code>인지는 알 수 없습니다. 중간자가 양쪽과 별도의
          비밀을 만들 수 있기 때문입니다.{" "}
          <Link to="/cs/crypto/diffie-hellman#security">
            인증 없는 DH의 중간자 경계
          </Link>
          가 TLS에서 certificate와 CertificateVerify가 필요한 이유입니다.
        </p>
        <p>
          여기서 X25519와 key share는 이 <em>전체 인증서 기반 사례</em>의
          선택입니다. TLS 1.3 전체에서 항상 필수인 것은 아닙니다. 클라이언트가
          빈 key share를 보내 서버의 그룹 선택을 먼저 받을 수도 있고,
          재연결에서는 PSK만 쓰는
          <code>psk_ke</code>와 PSK에 비대칭 키 교환을 더하는
          <code>psk_dhe_ke</code>가 모두 정의되어 있습니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <TLSHandshakeViz />
      </div>
      <ExplainedFormula
        question="서버의 서명이 이번 연결에서 실제로 협상한 메시지 전체를 어떻게 묶을까요?"
        idea={
          <>
            각 handshake message의 직렬화 bytes를 순서대로 누적해 transcript
            hash를 만들고, 서버는 전용 context와 그 hash에 서명합니다. 메시지
            하나가 바뀌면 hash가 달라져 같은 서명을 재사용할 수 없습니다.
          </>
        }
        formula={String.raw`\begin{aligned}
T_{cert} &= \operatorname{Hash}(M_1\,\|\cdots\|\,M_{cert}),\\
S &= 0x20^{64}\,\|\,\text{context}\,\|\,0x00\,\|\,T_{cert},\\
\sigma &= \operatorname{Sign}_{sk_{cert}}(S),\qquad
\operatorname{Verify}_{pk_{cert}}(\sigma,S)=\mathrm{true}.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
T_{cert} &= \operatorname{Hash}(\underbrace{M_1\,\|\cdots\|\,M_{cert}}_{\text{ClientHello부터 Certificate까지}}),\\
S &= \underbrace{0x20^{64}}_{\text{공백 64바이트}}\,\|\,
\underbrace{\text{context}}_{\text{서버 CertificateVerify 전용 문자열}}\,\|\,
\underbrace{0x00}_{\text{구분자}}\,\|\,\underbrace{T_{cert}}_{\text{이번 협상}},\\
\underbrace{\operatorname{Verify}_{pk_{cert}}(\sigma,S)}_{\text{인증서 공개키로 검사}}&=\mathrm{true}.
\end{aligned}`}
        operations={[
          {
            expression: String.raw`\operatorname{Hash}(M_1\,\|\cdots\|\,M_{cert})`,
            annotation: [
              "직렬화된 메시지를 실제 순서대로 누적",
              "ClientHello부터 서버 Certificate까지 포함",
              "협상 한 바이트가 달라도 다른 값",
            ],
          },
          {
            expression: String.raw`0x20^{64}\,\|\,\text{context}\,\|\,0x00\,\|\,T_{cert}`,
            annotation: [
              "공백 64바이트와 0 구분자를 정확히 포함",
              "서버 문맥은 “TLS 1.3, server CertificateVerify”",
              "다른 프로토콜 서명과 혼동을 막음",
            ],
          },
          {
            expression: String.raw`\operatorname{Verify}_{pk_{cert}}(\sigma,S)`,
            annotation: [
              "브라우저가 인증서 공개키로 같은 S를 검증",
              "참이면 해당 개인키 소유와 transcript 결속",
              "서비스 이름 일치는 별도 검사",
            ],
          },
        ]}
        terms={[
          {
            symbol: "M_i",
            name: "handshake message bytes",
            description:
              "ClientHello부터 현재 지점까지 wire에 직렬화된 i번째 메시지입니다.",
          },
          {
            symbol: "T_cert",
            name: "transcript hash",
            description: "순서와 내용을 고정하는 누적 hash입니다.",
          },
          {
            symbol: "sk_cert, pk_cert",
            name: "certificate key pair",
            description:
              "서버가 소유를 증명하는 개인 키와 인증서의 공개 키입니다.",
          },
          {
            symbol: "context",
            name: "TLS 1.3 signature context",
            description:
              "서버 경로에서는 정확히 “TLS 1.3, server CertificateVerify”인 domain-separation 문자열입니다.",
          },
        ]}
        assumptions={[
          "Client가 certificate chain·유효 기간·의도한 server name을 별도 정책으로 검증해야 합니다.",
          "Hash의 collision resistance와 signature의 unforgeability, 정확한 transcript 직렬화가 필요합니다.",
          "식은 certificate-based server authentication 경로를 보이며 PSK-only mode에는 같은 certificate signature가 없습니다.",
        ]}
        interpretation="api.example 연결에서 key share나 cipher suite 한 바이트만 바뀌어도 T_cert와 S가 달라져 서명이 맞지 않습니다. 그래도 서명 검증만으로 이름이 맞는 것은 아닙니다. 브라우저가 URL에서 만든 DNS-ID api.example과 인증서의 subjectAltName을 별도로 맞춰야 합니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>인증서 공개키가 맞아도 서비스 이름을 다시 확인합니다</h3>
        <p>
          브라우저는 서버가 보낸 이름을 보고 기대 이름을 정하지 않습니다. 먼저
          사용자가 연 URL에서 참조 이름 <code>api.example</code>을 만들고,
          인증서의
          <code>subjectAltName</code>에 제시된 DNS-ID와 비교합니다. Common
          Name은 서비스 식별에 쓰지 않습니다. 이름이 다르면 개인키 서명이
          올바르더라도 의도한 서버라는 검사는 실패합니다.
        </p>
        <div
          id="paper-rfc9525"
          className="scroll-mt-24 border-l border-primary/50 pl-4"
        >
          <p className="text-xs font-bold text-primary">명세 읽기 · RFC 9525</p>
          <CitationBlock
            source="IETF RFC 9525 — Service Identity in TLS"
            citeKey={2}
            href="https://www.rfc-editor.org/rfc/rfc9525.html"
          >
            클라이언트가 서버 제시값과 독립적으로 참조 식별자를 만들고, 인증서의
            제시 식별자와 맞추며, Common Name을 서비스 이름으로 사용하지 않는
            규칙을 확인합니다.
          </CitationBlock>
        </div>
        <h3>Finished는 양쪽이 같은 상태에 도달했는지 확인합니다</h3>
        <p>
          CertificateVerify가 server identity와 transcript를 묶는다면 Finished는
          handshake traffic secret에서 파생한 finished key로 transcript MAC을
          계산합니다. 한쪽이 다른 message sequence나 다른 key schedule을
          계산했다면 검증은 실패합니다.
        </p>
        <p>
          서버 Finished를 확인한 브라우저가 자기
          Finished를 보내면 전체 핸드셰이크가 끝납니다. 그 뒤 양방향 application
          traffic secret을 사용합니다.
        </p>
        <h3>0‑RTT는 latency와 replay risk를 교환합니다</h3>
        <p>
          이것은 현재의 새 연결 사례가 아니라 다음 연결의 변형입니다. Resumption
          ticket의 PSK로 early traffic key를 만들면 ClientHello와 함께 early
          data를 보낼 수 있습니다.
        </p>
        <p>
          하지만 공격자가 같은 암호문을 다시 전달할 수
          있으므로 “GET이면 항상 안전”처럼 메서드 이름만 보고 결정할 수
          없습니다. 결제·할당량·로그처럼 다시 실행될 때 생기는 효과를 확인하고,
          replay cache와 application idempotency key를 두거나 0‑RTT를 거부해야
          합니다.
        </p>
      </div>
    </section>
  );
}
