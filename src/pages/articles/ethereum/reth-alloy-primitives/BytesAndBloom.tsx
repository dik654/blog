import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function BytesAndBloom({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="bytes-bloom" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">같은 해시 도구도 Bloom에서는 비트 세 곳을 고릅니다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("bloom-accrue", codeRefs["bloom-accrue"])} />
        <CodeViewButton onClick={() => onCodeRef("bloom-contains", codeRefs["bloom-contains"])} />
      </div>
      <ExplainedFormula
        question="m-bit bloom에 n개 항목을 k개 위치로 표시하면 false-positive 확률을 어떻게 근사할까요?"
        idea="한 bit가 끝까지 0일 확률을 지수로 근사한 뒤, 조회한 k개 bit가 모두 1일 확률을 구합니다. Ethereum log bloom은 고정 parameter를 쓰므로 식은 직관·fixture 설계에 사용합니다."
        formula={String.raw`p_{fp}\approx\left(1-e^{-kn/m}\right)^k`}
        annotatedFormula={String.raw`p_{fp}\approx\left(1-\underbrace{e^{-kn/m}}_{\text{한 bit가 아직 0일 확률}}\right)^{k}`}
        operations={[
          { expression: String.raw`e^{-kn/m}`, annotation: ["n개 항목이 각각 k개 위치를 켠 뒤에도","특정 bit가 0으로 남을 확률의 지수 근사","m=2048, k=3, n=100이 예시"] },
          { expression: String.raw`\left(1-e^{-kn/m}\right)^k`, annotation: ["조회한 k개 bit가 전부 1일 확률 ≈0.25%","negative는 부재 확정, positive는 후보라","receipt/log 원문을 반드시 확인"] },
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
          CREATE 주소에서는 digest의 마지막 20바이트를 썼지만, log bloom에서는 address나 topic의 Keccak-256 digest에서 세 개의
          11비트 위치를 고릅니다. 같은 해시 함수라도 입력 문맥과 결과를 읽는 규칙이 다릅니다. 조회할 때 세 비트 중 하나라도 0이면
          해당 항목은 없지만, 셋이 모두 1이어도 다른 항목들이 우연히 켠 비트일 수 있으므로 실제 log를 다시 확인해야 합니다.
        </p>
      </div>
    </section>
  );
}
