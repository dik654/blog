import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import TLSKeyScheduleViz from "./viz/TLSKeyScheduleViz";

export default function KeySchedule() {
  return (
    <section id="key-schedule" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Key schedule은 하나의 secret을 용도·방향·시점별 key로 분리합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          ECDHE output을 그대로 모든 암호 연산에 쓰면 한 용도의 key 노출이나
          protocol confusion이 다른 용도까지 번질 수 있습니다. HKDF(HMAC-based
          Extract-and-Expand Key Derivation Function)는 입력 key material을 먼저
          균일한 pseudorandom key로 추출하고, label과 transcript context를 넣어
          client/server handshake·application·resumption secret을 따로
          확장합니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <TLSKeyScheduleViz />
      </div>
      <ExplainedFormula
        question="같은 ECDHE secret에서 나온 key가 서로 다른 용도로 재사용되지 않게 하려면 어떻게 할까요?"
        idea={
          <>
            HKDF-Extract가 salt와 input key material을 PRK로 압축하고,
            HKDF-Expand-Label이 protocol label·용도 label·transcript hash를 넣어
            서로 다른 output을 만듭니다.
          </>
        }
        formula={String.raw`\begin{aligned}
PRK &= \operatorname{HKDF\!\text{-}Extract}(salt,IKM),\\
S_{role,phase} &= \operatorname{HKDF\!\text{-}Expand\!\text{-}Label}
(PRK,label,H(T),L),\\
K &= \operatorname{ExpandLabel}(S_{role,phase},\text{"key"},\varnothing,L_K).
\end{aligned}`}
        terms={[
          {
            symbol: "IKM",
            name: "input keying material",
            description:
              "단계에 따라 PSK, ECDHE shared secret 또는 0이 들어갑니다.",
          },
          {
            symbol: "PRK",
            name: "pseudorandom key",
            description: "Extract 결과로, 다음 단계 Expand의 key가 됩니다.",
          },
          {
            symbol: "label",
            name: "domain-separation label",
            description:
              "client/server와 handshake/application 같은 용도를 구분합니다.",
          },
          {
            symbol: "H(T)",
            name: "transcript context",
            description: "현재 단계까지 합의한 handshake message hash입니다.",
          },
          {
            symbol: "L, L_K",
            name: "output lengths",
            description: "선택한 hash와 AEAD가 요구하는 byte 길이입니다.",
          },
        ]}
        assumptions={[
          "HMAC과 선택한 hash가 안전하고 label·context·length encoding이 RFC 8446과 정확히 일치해야 합니다.",
          "Forward secrecy는 fresh (EC)DHE를 실제로 사용하고 ephemeral private key를 보호·폐기한 handshake에서만 기대할 수 있습니다.",
          "PSK-only mode와 0-RTT early data는 full (EC)DHE handshake와 같은 forward-secrecy·anti-replay 속성을 주지 않습니다.",
        ]}
        interpretation="같은 PRK라도 label이 c hs traffic과 s ap traffic으로 다르면 별도 secret이 나옵니다. 이 분리는 키가 우연히 같지 않게 하는 encoding 계약이며, 약한 PSK나 유출된 endpoint memory를 자동으로 복구해 주는 장치는 아닙니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>세 단계와 운영 경계를 함께 봅니다</h3>
        <p>
          Early secret은 PSK 또는 0에서 시작하고, handshake secret은 ECDHE
          input을 섞어 handshake traffic key를 만듭니다. Master secret에서는
          application traffic secret과 exporter·resumption master secret이
          갈라집니다. KeyUpdate는 현재 application traffic secret에서 다음
          generation을 만들지만, 이미 탈취된 endpoint가 계속 새 secret을 관찰할
          수 있는 상황까지 스스로 치유한다고 보장하지 않습니다.
        </p>
        <div
          id="paper-rfc5869"
          className="scroll-mt-24 border-l border-primary/50 pl-4"
        >
          <p className="text-xs font-bold text-primary">명세 읽기 · RFC 5869</p>
          <p>
            RFC 5869은 generic HKDF의 Extract와 Expand를 정의합니다. TLS 1.3의
            labeled tree는 RFC 8446이 그 primitive 위에 추가한 protocol-specific
            구조이므로 두 문서의 책임을 구분해야 합니다.
          </p>
          <CitationBlock
            source="IETF RFC 5869 — HMAC-based Extract-and-Expand Key Derivation Function"
            citeKey={2}
            href="https://www.rfc-editor.org/rfc/rfc5869.html"
          >
            Extract가 input key material을 PRK로 만들고 Expand가 context별
            output keying material을 만드는 primitive 경계를 확인합니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
