import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import AddressingCompareViz from "./viz/AddressingCompareViz";

const HELLO_CID = "bafkreibm6jg3ux5qumhcn2b3flc3tyu6dmlb4xa7u5bf44yegnrjhc4yeq";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Content address는 파일을 보관한 곳이 아니라 받아야 할 bytes를 가리킵니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          <strong>
            URL이 “어디에 요청할까?”에 답한다면, content address는 “받은 bytes가
            내가 요청한 것과 같은가?”에 답합니다.
          </strong>{" "}
          그래서 provider가 바뀌어도 같은 bytes를 검증할 수 있지만, provider를
          찾거나 계속 보관하게 만들지는 못합니다.
        </p>
        <p>
          이 글은 정확히 다섯 글자인 raw bytes <code>hello</code> 하나를 끝까지
          따라갑니다. SHA-256 digest는
          <code>2cf24dba…38b9824</code>, raw CIDv1 문자열은
          <code>{HELLO_CID}</code>입니다. 뒤에서는 이 block을 project Merkle
          DAG의 <code>readme</code> leaf로 재사용하고, <code>lib.rs</code>를
          고쳐 새 root가 생긴 뒤 IPNS와 DNSLink가 새 root를 가리키게 합니다.
        </p>
        <p>
          Hash 일치는 byte integrity만 확인합니다. 작성자, 내용의 진실성,
          malware 안전성은 증명하지 않습니다. 같은 논리적 내용도 newline, codec,
          key order, chunking이 달라 실제 hash 입력 bytes가 달라지면 다른 CID가
          됩니다.
        </p>
      </div>
      <ContentBoundary article="content-addressing" />
      <div className="not-prose my-8">
        <AddressingCompareViz />
      </div>
      <ExplainedFormula
        question="Provider가 돌려준 bytes를 왜 다시 hash해야 할까요?"
        idea={
          <>
            CID를 만들 때 확정한 bytes의 digest를 기대값으로 둡니다. 수신자는
            받은 bytes를 같은 algorithm으로 hash한 뒤 그 기대값과 비교합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
b &= \operatorname{Encode}_{codec}(x),\\
d &= H(b),\\
\operatorname{accept}(b^{\prime}) &\iff H(b^{\prime})=d.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
b &= \underbrace{\operatorname{Encode}_{codec}(x)}_{\text{주소를 붙일 실제 bytes}},\\
d &= \underbrace{H(b)}_{\text{CID가 운반하는 기대 digest}},\\
\operatorname{accept}(b^{\prime}) &\iff \underbrace{H(b^{\prime})=d}_{\text{받은 bytes를 재해시해 비교}}.
\end{aligned}`}
        operations={[
          {
            expression: String.raw`\operatorname{Encode}_{codec}(x)`,
            annotation: [
              "논리 값 x를 codec 규칙으로 직렬화합니다",
              "이 결과 b가 실제 hash 입력입니다",
              "newline·key order가 달라지면 b도 달라집니다",
            ],
          },
          {
            expression: String.raw`H(b)`,
            annotation: [
              "b를 SHA-256 같은 algorithm에 넣습니다",
              "hello의 결과는 2cf24dba…38b9824입니다",
              "CID의 multihash가 algorithm과 digest를 함께 운반합니다",
            ],
          },
          {
            expression: String.raw`H(b^{\prime})=d`,
            annotation: [
              "Provider에서 받은 b′를 같은 방식으로 hash합니다",
              "기대 digest d와 같을 때만 bytes를 수락합니다",
              "일치해도 publisher·availability는 별도 문제입니다",
            ],
          },
        ]}
        terms={[
          {
            symbol: "x",
            name: "Logical value",
            description: "파일이나 IPLD node처럼 주소를 붙이려는 값입니다.",
          },
          {
            symbol: "b",
            name: "Encoded bytes",
            description: "Codec이 확정한 원래 hash 입력입니다.",
          },
          {
            symbol: "d",
            name: "Expected digest",
            description: "CID의 multihash 안에 들어가는 기대 hash 결과입니다.",
          },
          {
            symbol: "b^{\\prime}",
            name: "Received bytes",
            description: "Provider에서 실제로 받아 다시 검증할 bytes입니다.",
          },
        ]}
        assumptions={[
          "Hash가 collision·second-preimage attack에 충분히 강하고 구현이 CID의 algorithm code와 digest length를 그대로 따라야 합니다.",
          "같은 논리 값이라도 codec·chunking이 다르면 encoded bytes와 CID가 달라질 수 있습니다.",
          "Digest 일치는 byte integrity일 뿐 publisher identity·semantic safety·availability를 보장하지 않습니다.",
        ]}
        interpretation="UTF-8 hello는 68 65 6c 6c 6f이고 SHA-256은 2cf24dba…38b9824입니다. hello!를 받으면 hash가 달라져 같은 CID 요청의 응답으로 수락할 수 없습니다."
      />
      <div className="not-prose my-6 rounded-xl border border-border/70 bg-muted/20 p-4 text-sm leading-6">
        <p className="font-semibold">공식 raw hello 예를 bytes부터 따라가기</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-foreground/75">
          <li>
            <code>hello</code>의 UTF-8은 <code>68 65 6c 6c 6f</code>입니다.
          </li>
          <li>
            SHA-256 결과는 <code>2cf24dba…38b9824</code>입니다.
          </li>
          <li>
            앞에 CIDv1·raw·sha2-256·32-byte 표지인
            <code>01 55 12 20</code>을 붙입니다.
          </li>
          <li>
            그 binary CID를 base32로 쓰면 <code>{HELLO_CID}</code>입니다.
          </li>
        </ol>
      </div>
      <CitationBlock
        source="IPFS Standards — CID (Content IDentifier)"
        citeKey={1}
        href="https://specs.ipfs.tech/cid/"
      >
        <p id="paper-cid-spec" className="text-sm leading-6">
          2026-06-26 current specification의 raw hello test vector와 CIDv1
          binary 구조, strict decoder 규칙을 사용합니다. CID format을
          availability나 routing 성능의 근거로 확대하지 않습니다.
        </p>
      </CitationBlock>
    </section>
  );
}
