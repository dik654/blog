import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import CIDStructViz from "./viz/CIDStructViz";

export default function CID() {
  return (
    <section id="cid" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        CID는 hash만 적은 문자열이 아니라 bytes를 검증하고 읽는 방법까지 담은
        주소입니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <strong>
            Raw hello CID의 <code>01 55 12 20</code>은 각각 CIDv1, raw codec,
            sha2-256, 32-byte digest length를 뜻합니다.
          </strong>{" "}
          그 뒤에 실제 digest 32 bytes가 옵니다. 그래서 decoder는 format과 hash
          algorithm을 바깥 설정으로 추측하지 않아도 됩니다.
        </p>
        <p>
          문자열 맨 앞의 <code>b</code>는 binary CID를 base32로 표현했다는
          multibase prefix입니다. Binary CID의 첫 field는 <code>0x01</code>이지
          <code>b</code>가 아닙니다. 같은 binary CID를 다른 허용 multibase로
          표현하면 문자열은 달라도 content address의 binary 값은 같습니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <CIDStructViz />
      </div>
      <ExplainedFormula
        question="Binary CIDv1 안에서 codec과 hash 정보는 어떻게 이어질까요?"
        idea="작은 정수 field는 minimal unsigned varint로 쓰고, multihash는 hash algorithm code·digest byte 수·digest를 연달아 둡니다."
        formula={String.raw`\begin{aligned}
\mathrm{CIDv1}_{bin} &= \operatorname{varint}(1)\,\|\,\operatorname{varint}(codec)\,\|\,mh,\\
mh &= \operatorname{varint}(hcode)\,\|\,\operatorname{varint}(|d|)\,\|\,d.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\mathrm{CIDv1}_{bin} &= \underbrace{\operatorname{varint}(1)}_{\text{CIDv1}}\,\|\,\underbrace{\operatorname{varint}(codec)}_{\text{content 형식}}\,\|\,\underbrace{mh}_{\text{self-describing hash}},\\
mh &= \underbrace{\operatorname{varint}(hcode)}_{\text{hash algorithm}}\,\|\,\underbrace{\operatorname{varint}(|d|)}_{\text{digest byte 수}}\,\|\,\underbrace{d}_{\text{digest bytes}}.
\end{aligned}`}
        operations={[
          {
            expression: String.raw`\operatorname{varint}(1)`,
            annotation: [
              "첫 minimal varint가 1이면 CIDv1입니다",
              "raw hello에서는 한 byte 0x01입니다",
            ],
          },
          {
            expression: String.raw`\operatorname{varint}(codec)`,
            annotation: [
              "Digest가 가리키는 content 형식을 식별합니다",
              "raw codec code는 0x55입니다",
            ],
          },
          {
            expression: String.raw`\operatorname{varint}(hcode)\,\|\,\operatorname{varint}(|d|)`,
            annotation: [
              "0x12는 sha2-256 algorithm code입니다",
              "0x20은 뒤 digest가 32 bytes라는 뜻입니다",
            ],
          },
          {
            expression: String.raw`\operatorname{varint}(|d|)\,\|\,d`,
            annotation: [
              "선언한 길이만큼 digest를 정확히 읽습니다",
              "Truncated input이나 남는 trailing bytes를 거부합니다",
            ],
          },
        ]}
        terms={[
          {
            symbol: "codec",
            name: "Content multicodec",
            description: "raw·dag-pb·dag-cbor처럼 bytes의 해석 format입니다.",
          },
          {
            symbol: "hcode",
            name: "Hash function code",
            description: "sha2-256 등 digest를 계산한 algorithm의 code입니다.",
          },
          {
            symbol: "|d|",
            name: "Digest length",
            description: "뒤따르는 digest의 정확한 byte 수입니다.",
          },
          {
            symbol: "d",
            name: "Digest bytes",
            description: "Content bytes를 hash한 실제 결과입니다.",
          },
        ]}
        assumptions={[
          "각 varint는 최소 길이로 인코딩해야 하며 overlong representation은 거부합니다.",
          "Content codec은 bytes의 형식을 식별하지만 그 schema의 의미상 유효성까지 보장하지 않습니다.",
          "CIDv0은 정확한 34-byte sha2-256 multihash와 implicit dag-pb를 쓰는 제한된 legacy form입니다.",
        ]}
        interpretation="Raw hello는 01 | 55 | 12 | 20 | 2cf24dba…38b9824로 분해됩니다. 즉 앞 네 표지는 4 bytes이고 뒤 digest는 32 bytes여서 binary CIDv1 전체는 36 bytes입니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <AlgorithmBlock
          title="bafk…4yeq를 strict하게 읽는 순서"
          input={[
            "CID string bafkreibm6jg3…hc4yeq",
            "multibase·multicodec·multihash registry",
          ]}
          steps={[
            {
              code: "prefix 'b' → base32_decode(rest)",
              note: "Multibase는 문자열을 binary CID로 되돌리는 바깥 표현입니다.",
            },
            {
              code: "read_minimal_varint() == 0x01",
              note: "CIDv1만 허용하고 예약 version·overlong varint를 거부합니다.",
            },
            {
              code: "codec = read_minimal_varint()  // 0x55 raw",
              note: "Hash 대상 bytes를 어떤 content format으로 읽을지 정합니다.",
            },
            {
              code: "hcode=0x12; digest_len=0x20",
              note: "Sha2-256 digest 32 bytes가 이어져야 합니다.",
            },
            {
              code: "digest = read_exact(32); require_eof()",
              note: "부족한 digest와 뒤에 남은 bytes를 모두 거부합니다.",
            },
          ]}
          output="CIDv1(raw, sha2-256, 2cf24dba…38b9824)"
        />
        <p>
          Strict decoding이 필요한 이유는 같은 identifier를 여러 byte 표현으로
          만들지 않기 위해서입니다. Decoder가 overlong varint나 trailing bytes를
          눈감아 주면 cache key, signature 대상, equality 판정이 구현마다 달라질
          수 있습니다.
        </p>
      </div>
    </section>
  );
}
