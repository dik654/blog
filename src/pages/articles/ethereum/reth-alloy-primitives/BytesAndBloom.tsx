import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function BytesAndBloom({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="bytes-bloom" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Log bloom은 “없음”은 빠르게 증명하지만 “있음”은 후보만 만든다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("bloom-accrue", codeRefs["bloom-accrue"])} />
        <CodeViewButton onClick={() => onCodeRef("bloom-contains", codeRefs["bloom-contains"])} />
      </div>
      <ExplainedFormula
        question="m-bit bloom에 n개 항목을 k개 위치로 표시하면 false-positive 확률을 어떻게 근사할까요?"
        idea="한 bit가 끝까지 0일 확률을 지수로 근사한 뒤, 조회한 k개 bit가 모두 1일 확률을 구합니다. Ethereum log bloom은 고정 parameter를 쓰므로 식은 직관·fixture 설계에 사용합니다."
        formula={String.raw`p_{fp}\approx\left(1-e^{-kn/m}\right)^k`}
        annotatedFormula={String.raw`\underbrace{p_{fp}}_{\text{false-positive 확률 계산}}\approx\left(1-e^{-kn/m}\right)^k`}
        operations={[
          { expression: String.raw`p_{fp}`, annotation: ["false-positive 확률이(가) 식의 결과에 기여하는","방식을 계산합니다.","한 bit가 끝까지 0일 확률을 지수로 근사한 뒤, 조회한","k개 bit가 모두 1일 확률을 구합니다."] },
        ]}
        terms={[
          { symbol: "p_{fp}", name: "false-positive 확률", description: "실제 항목이 없지만 후보로 통과할 근사 확률" },
          { symbol: "m", name: "bitmap bit 수", description: "Ethereum log bloom에서는 2,048 bits" },
          { symbol: "n", name: "삽입 항목 수", description: "해당 bloom에 accrue한 address/topic 수" },
          { symbol: "k", name: "bit 위치 수", description: "항목 하나가 설정·검사하는 hash-derived 위치 수" },
        ]}
        assumptions={["Hash-derived 위치가 독립적이고 균등하다는 근사를 사용합니다.", "단위는 모두 count 또는 무차원 확률이며 실제 Ethereum 위치 선택은 protocol code를 따릅니다.", "Bloom positive 뒤에는 receipt/log 원문을 반드시 확인합니다."]}
        interpretation="m=2048, k=3, n=100이면 약 0.25%의 false positive가 예상됩니다. Negative는 항목 부재를 뜻하지만 positive는 실제 log 존재를 뜻하지 않습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Bytes는 길이가 변할 수 있는 owned buffer이고 FixedBytes는 폭 invariant를 갖습니다. Bloom을 만들 때는 address/topic의
          exact bytes를 Keccak-256에 넣어 protocol이 정한 세 위치를 켜며, query도 같은 bytes·bit ordering을 써야 합니다.
        </p>
        <h3>Type·codec release gate</h3>
        <p>
          Boundary value(0, 127, 128, 255, U256 MAX), wrong width, endian reversal, non-canonical RLP, trailing bytes, CREATE/CREATE2
          domain과 bloom false positive를 old/new crate에 재생합니다. Typed value·encoded bytes·decode error·hash/address·bloom bits
          parity를 먼저 통과한 뒤 allocation·throughput을 비교하고 crate version과 rollback lockfile을 함께 보존합니다.
        </p>
      </div>
    </section>
  );
}
