import ExplainedFormula from "@/components/ui/explained-formula";
import CIDStructViz from "./viz/CIDStructViz";

export default function CID() {
  return (
    <section id="cid" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        CIDv1은 version·codec·multihash를 담은 typed content address입니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          CID(Content Identifier)를 단순히 “hash 문자열”이라고 부르면 중요한
          type 정보가 빠집니다. Binary CIDv1은 version varint, content codec
          varint, multihash로 구성됩니다. Multihash 안에는 다시 hash algorithm
          code, digest length와 digest bytes가 들어갑니다. 문자열 앞의 multibase
          prefix는 이 binary CID를 base32·base58btc 등 어떤 문자 체계로
          표현했는지 알려 주며 binary CID 자체의 일부는 아닙니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <CIDStructViz />
      </div>
      <ExplainedFormula
        question="CID parser는 문자열에서 어떤 순서로 type과 digest를 복구할까요?"
        idea={
          <>
            먼저 multibase prefix로 문자열을 bytes로 되돌리고, minimal varint로
            version과 codec을 읽은 뒤 multihash의 algorithm·length·digest를
            정확히 소비합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
\mathrm{CIDv1}_{bin} &= \operatorname{varint}(1)\,\|\,
\operatorname{varint}(codec)\,\|\,\operatorname{multihash}(b),\\
\operatorname{multihash}(b) &= \operatorname{varint}(hcode)\,\|\,
\operatorname{varint}(|d|)\,\|\,d.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\mathrm{CIDv1}_{bin} &= \underbrace{\operatorname{varint}(1)\,\|\,
\operatorname{varint}(codec)\,\|\,\operatorname{multihash}(b),}_{\text{unsigned variable 계산}}\\
\operatorname{multihash}(b) &= \underbrace{\operatorname{varint}(hcode)\,\|\,
\operatorname{varint}(|d|)\,\|\,d.}_{\text{unsigned variable 계산}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\operatorname{varint}(1)\,\|\,
\operatorname{varint}(codec)\,\|\,\operatorname{multihash}(b),`, annotation: ["unsigned variable integer이(가) 식의","결과에 기여하는 방식을 계산합니다.","먼저 multibase prefix로 문자열을 bytes로","되돌리고, minimal varint로 version과"] },
          { expression: String.raw`\operatorname{varint}(hcode)\,\|\,
\operatorname{varint}(|d|)\,\|\,d.`, annotation: ["unsigned variable integer이(가) 식의","결과에 기여하는 방식을 계산합니다.","먼저 multibase prefix로 문자열을 bytes로","되돌리고, minimal varint로 version과"] },
        ]}
        terms={[
          {
            symbol: "codec",
            name: "content multicodec",
            description:
              "raw, dag-pb, dag-cbor처럼 digest가 가리키는 bytes의 해석 format입니다.",
          },
          {
            symbol: "hcode",
            name: "hash function code",
            description: "sha2-256 등 digest를 계산한 algorithm을 식별합니다.",
          },
          {
            symbol: "|d|",
            name: "digest length",
            description:
              "뒤따르는 digest byte 수이며 trailing·truncated input 검증에 사용합니다.",
          },
          {
            symbol: "varint",
            name: "unsigned variable integer",
            description:
              "작은 code를 적은 bytes로 표현하되 CID parser는 최소 인코딩만 허용합니다.",
          },
        ]}
        assumptions={[
          "CIDv1 parser는 overlong varint, truncated digest와 multihash 뒤 trailing bytes를 거부해야 합니다.",
          "Codec code는 bytes를 어떻게 decode할지 말하지만 content가 그 schema에서 의미상 유효하다고 자동 보장하지 않습니다.",
          "CIDv0은 34-byte sha2-256 multihash와 implicit dag-pb라는 제한된 legacy form입니다.",
        ]}
        interpretation="공식 예의 raw 'hello'는 01(version) 55(raw) 12(sha2-256) 20(32-byte length) 뒤에 digest가 옵니다. 같은 binary CID를 base32와 base58btc로 쓰면 문자열은 달라도 content address는 같습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Decoder는 permissive하게 추측하지 않습니다</h3>
        <p>
          CIDv0은 정확히 34 bytes이고 0x12 0x20으로 시작하는 경우에만
          판정합니다. CIDv1은 leading varint 0x01을 요구하며 reserved
          version이나 남는 bytes를 거부합니다. 이렇게 canonical encoding을
          강제해야 같은 identifier가 여러 byte representation으로 나타나 cache
          key·signature 검증을 흔드는 문제를 줄일 수 있습니다.
        </p>
      </div>
    </section>
  );
}
