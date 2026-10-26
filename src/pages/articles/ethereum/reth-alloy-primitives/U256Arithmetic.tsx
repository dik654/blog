import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function U256Arithmetic({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="u256-arithmetic" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">U256의 내부 조각 순서는 RLP 바이트 순서와 다릅니다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("u256-limbs", codeRefs["u256-limbs"])} />
        <CodeViewButton onClick={() => onCodeRef("u256-overflowing", codeRefs["u256-overflowing"])} />
      </div>
      <ExplainedFormula
        question="낮은 자리부터 놓인 64비트 조각(limb) 네 개는 어떤 U256 값을 나타낼까요?"
        idea="각 조각을 2⁶⁴ 진법의 한 자리로 보고 낮은 자리부터 가중해 더합니다. 이는 메모리 안의 산술 표현이며, 바깥으로 내보내는 RLP의 big-endian 바이트 순서와는 별개입니다."
        formula={String.raw`x=\sum_{i=0}^{3}\ell_i2^{64i},\qquad 0\leq \ell_i<2^{64}`}
        annotatedFormula={String.raw`x=\underbrace{\sum_{i=0}^{3}\ell_i2^{64i}}_{\text{limb 네 자리 가중합}},\qquad \underbrace{0\leq \ell_i<2^{64}}_{\text{limb 하나는 64비트}}`}
        operations={[
          { expression: String.raw`\sum_{i=0}^{3}\ell_i2^{64i}`, annotation: ["i번째 조각을 2⁶⁴ⁱ 자리에 놓고 낮은 자리부터 더함", "[5,1,0,0] → x = 5 + 2⁶⁴", "RLP 바이트 순서와는 별개인 숫자 해석"] },
          { expression: String.raw`0\leq \ell_i<2^{64}`, annotation: ["조각 하나는 u64이므로 2⁶⁴보다 작음", "전체 값 x는 0부터 2²⁵⁶−1까지"] },
        ]}
        terms={[
          { symbol: "x", name: "U256 값", description: "0부터 2²⁵⁶−1 사이의 부호 없는 정수" },
          { symbol: "\\ell_i", name: "i번째 조각", description: "배열에서 i번째에 놓인 64비트 부호 없는 정수" },
          { symbol: "2^{64i}", name: "자리 가중치", description: "i번째 조각이 담당하는 2⁶⁴진법 자리" },
          { symbol: "i", name: "조각의 위치", description: "낮은 자리부터 놓인 내부 배열의 0·1·2·3" },
        ]}
        assumptions={["정확히 네 개의 64비트 조각을 사용합니다.", "이 식은 숫자의 값을 설명하며 메모리 바이트 순서나 RLP 인코딩을 직접 정하지 않습니다.", "덧셈 결과가 2²⁵⁶ 이상이면 API가 오류·순환·최댓값 고정 중 어떤 동작을 택하는지 확인해야 합니다."]}
        interpretation="[5,1,0,0]이면 x=5+2⁶⁴입니다. MAX+1은 표현 범위를 벗어나므로 checked_add는 실패하고 wrapping_add는 0이 됩니다. 호출부는 오류와 순환 중 어느 동작이 필요한지 명시해야 합니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          ruint 1.18.0의 덧셈은 낮은 조각에서 생긴 carry를 다음 조각으로 전달합니다. EVM 연산처럼 2²⁵⁶에서 순환하는 값이
          필요한 곳도 있지만, 잔액 합산이나 길이 계산처럼 범위를 넘으면 실패해야 하는 곳도 있습니다. 따라서 U256이라는 타입만
          보고 판단하지 말고 호출부가 <code>checked</code>·<code>wrapping</code>·<code>saturating</code> 중 어느 동작을
          선택했는지 확인해야 합니다.
        </p>
      </div>
    </section>
  );
}
