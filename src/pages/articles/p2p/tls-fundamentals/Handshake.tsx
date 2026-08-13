import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import TLSHandshakeViz from "./viz/TLSHandshakeViz";

export default function Handshake() {
  return (
    <section id="handshake" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Handshake는 shared secret, identity, transcript를 한 합의로 묶습니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          ClientHello는 지원 version·cipher suite·signature algorithm·key
          share를 제안하고 ServerHello는 하나를 선택합니다. 두 key share로 ECDHE
          shared secret을 계산할 수 있지만, 이것만으로 상대가 진짜 서버인지 알
          수는 없습니다. 중간자가 자신의 key share 두 개로 각각 연결할 수 있기
          때문입니다.{" "}
          <Link to="/crypto/diffie-hellman#security">
            인증 없는 DH의 중간자 경계
          </Link>
          가 TLS에서 certificate와 CertificateVerify가 필요한 이유입니다.
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
T_n &= \operatorname{Hash}(M_1\,\|\,M_2\,\|\cdots\|\,M_n),\\
\sigma &= \operatorname{Sign}_{sk_{cert}}(\text{context}\,\|\,T_n),\\
\operatorname{Verify}_{pk_{cert}}(\sigma,\text{context}\,\|\,T_n)&=\mathrm{true}.
\end{aligned}`}
        terms={[
          {
            symbol: "M_i",
            name: "handshake message bytes",
            description:
              "ClientHello부터 현재 지점까지 wire에 직렬화된 i번째 메시지입니다.",
          },
          {
            symbol: "T_n",
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
              "다른 protocol에서 만든 서명을 TLS 서명으로 오인하지 않게 하는 domain-separation 문자열입니다.",
          },
        ]}
        assumptions={[
          "Client가 certificate chain·유효 기간·의도한 server name을 별도 정책으로 검증해야 합니다.",
          "Hash의 collision resistance와 signature의 unforgeability, 정확한 transcript 직렬화가 필요합니다.",
          "식은 certificate-based server authentication 경로를 보이며 PSK-only mode에는 같은 certificate signature가 없습니다.",
        ]}
        interpretation="ClientHello의 ALPN이나 key share 한 byte만 바뀌어도 T_n이 달라집니다. 다만 서명이 참이라는 사실은 private key 소유를 증명할 뿐, 그 certificate가 사용자가 의도한 hostname에 유효한지는 application 검증이 결정합니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Finished는 양쪽이 같은 상태에 도달했는지 확인합니다</h3>
        <p>
          CertificateVerify가 server identity와 transcript를 묶는다면 Finished는
          handshake traffic secret에서 파생한 finished key로 transcript MAC을
          계산합니다. 따라서 한쪽이 다른 message sequence나 다른 key schedule을
          계산했다면 검증이 실패합니다. Client Finished까지 확인한 후 양방향
          application traffic secret을 사용합니다.
        </p>
        <h3>0‑RTT는 latency와 replay risk를 교환합니다</h3>
        <p>
          Resumption ticket의 PSK로 early traffic key를 만들면 ClientHello와
          함께 early data를 보낼 수 있습니다. 하지만 공격자가 같은 encrypted
          flight를 다시 전달할 수 있으므로, “GET이면 항상 안전” 같은 method
          이름만으로 판정하면 안 됩니다. Payment·quota·logging처럼 재실행에 side
          effect가 있는지 확인하고, ticket single-use·freshness window·replay
          cache와 함께 application-level idempotency key를 설계하거나 0‑RTT를
          거부해야 합니다.
        </p>
      </div>
    </section>
  );
}
