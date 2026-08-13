import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import AddressingCompareViz from "./viz/AddressingCompareViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Content addressing은 “어디에 있나”보다 “받은 bytes가 맞나”를 먼저
        묻습니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          위치 주소인 URL은 어느 server에서 resource를 받을지 알려 주지만, 오늘
          받은 bytes가 어제와 같은지는 주소만으로 증명하지 못합니다. Content
          addressing(내용 주소 지정)은 canonical bytes의 cryptographic hash를
          주소에 넣습니다. 어느 peer에서 받았든 다시 hash해 주소와 같으면 같은
          bytes라는 무결성 검사를 할 수 있습니다.
        </p>
        <p>
          이 성질은 availability와 다릅니다. CID를 알아도 해당 block을 가진
          peer가 없으면 다운로드할 수 없고, malicious peer가 bytes를 숨기는 것도
          막지 못합니다. 또한 hash는 작성자의 identity나 content의 진실성을
          증명하지 않습니다. 누가 publish했는지는 signature·name
          system·application policy가 별도로 담당합니다.
        </p>
      </div>
      <ContentBoundary article="content-addressing" />
      <div className="not-prose my-8">
        <AddressingCompareViz />
      </div>
      <ExplainedFormula
        question="다른 peer에서 받은 bytes가 요청한 content와 같은지 어떻게 확인할까요?"
        idea={
          <>
            주소를 만들 때 codec으로 canonical bytes를 정하고 cryptographic
            hash를 계산합니다. 수신자는 같은 codec bytes를 다시 hash해 주소의
            digest와 비교합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
b &= \operatorname{Encode}_{codec}(x),\\
d &= H(b),\\
\operatorname{accept}(b^{\prime}) &\iff H(b^{\prime})=d.
\end{aligned}`}
        terms={[
          {
            symbol: "x",
            name: "logical value",
            description:
              "파일이나 IPLD node처럼 주소를 붙이려는 논리적 값입니다.",
          },
          {
            symbol: "b",
            name: "canonical encoded bytes",
            description: "선택한 codec 규칙으로 직렬화한 실제 hash 입력입니다.",
          },
          {
            symbol: "H",
            name: "cryptographic hash function",
            description:
              "임의 길이 bytes를 고정 길이 digest로 보내는 함수입니다.",
          },
          {
            symbol: "d",
            name: "digest",
            description: "CID의 multihash 안에 들어가는 hash 결과입니다.",
          },
          {
            symbol: "b^{\\prime}",
            name: "received bytes",
            description: "어떤 provider에서 실제로 받은 검증 대상입니다.",
          },
        ]}
        assumptions={[
          "Hash가 collision·second-preimage attack에 충분히 강하고 구현이 정확한 algorithm code와 digest length를 사용해야 합니다.",
          "같은 logical value라도 codec, map key order, chunking이 다르면 encoded bytes와 CID가 달라질 수 있습니다.",
          "Digest 일치는 byte integrity를 확인할 뿐 publisher identity, semantics, malware safety나 availability를 보장하지 않습니다.",
        ]}
        interpretation="'hello'의 raw SHA‑256 digest와 같은 bytes를 어느 peer에서 받아도 검증 결과는 같습니다. 반면 끝에 newline 하나를 붙이면 입력 bytes가 달라져 새 digest와 새 CID가 됩니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Hash 함수의 직관과 실제 보안 경계</h3>
        <p>
          장난감 예로 byte 합을 16으로 나눈 나머지를 주소로 쓰면 1+2와 0+3이
          모두 3이어서 쉽게 collision이 납니다. SHA‑256 같은 cryptographic
          hash는 이런 충돌을 현실적인 계산량으로 찾기 어렵게 설계하지만,
          수학적으로 collision이 존재하지 않는 일대일 함수는 아닙니다.
          Algorithm과 digest length를 주소가 함께 말해야 교체와 검증 정책을
          명확히 할 수 있습니다.
        </p>
        <div
          id="paper-cid-spec"
          className="scroll-mt-24 border-l border-primary/50 pl-4"
        >
          <p className="text-xs font-bold text-primary">
            명세 읽기 · CID specification
          </p>
          <p>
            현재 CID specification은 CIDv1을 version, content multicodec와
            multihash의 binary tuple로 정의하고, 문자열의 multibase는 binary CID
            바깥 표현임을 구분합니다. 여기서는 IPFS product 동작이 아니라
            identifier format만 근거로 사용합니다.
          </p>
          <CitationBlock
            source="IPFS Standards — CID (Content IDentifier)"
            citeKey={1}
            href="https://specs.ipfs.tech/cid/"
          >
            Typed content address의 binary 구조, CIDv0/v1 decoding과 malformed
            input rejection 규칙을 확인합니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
