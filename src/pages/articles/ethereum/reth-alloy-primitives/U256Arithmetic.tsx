import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function U256Arithmetic({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="u256-arithmetic" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">U256은 네 개의 64-bit limb를 하나의 unsigned value로 읽는다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("u256-limbs", codeRefs["u256-limbs"])} />
        <CodeViewButton onClick={() => onCodeRef("u256-overflowing", codeRefs["u256-overflowing"])} />
      </div>
      <ExplainedFormula
        question="Little-endian limb 네 개는 어떤 U256 값을 나타낼까요?"
        idea="각 limb를 2⁶⁴ 자리 하나로 보고 낮은 자리부터 가중해 더합니다. 이는 내부 산술 표현이며 RLP wire bytes의 순서와 구분합니다."
        formula={String.raw`x=\sum_{i=0}^{3}\ell_i2^{64i},\qquad 0\leq \ell_i<2^{64}`}
        terms={[
          { symbol: "x", name: "U256 값", description: "0부터 2²⁵⁶−1 사이의 unsigned integer" },
          { symbol: "\\ell_i", name: "i번째 limb", description: "배열의 i번째 64-bit unsigned word" },
          { symbol: "2^{64i}", name: "자리 가중치", description: "limb i가 담당하는 64-bit radix 위치" },
          { symbol: "i", name: "limb index", description: "little-endian 내부 배열에서 0·1·2·3" },
        ]}
        assumptions={["정확히 네 개의 64-bit limb를 사용합니다.", "식은 수학적 value 해석이며 memory byte order·RLP encoding을 직접 규정하지 않습니다.", "덧셈 결과가 2²⁵⁶ 이상이면 API가 checked·wrapping·saturating 중 무엇인지 명시해야 합니다."]}
        interpretation="limbs=[5,1,0,0]이면 x=5+2⁶⁴입니다. MAX+1은 수학적으로 범위 밖이므로 checked_add는 실패하고 wrapping_add는 0이 됩니다. 두 결과를 같은 business rule로 쓰면 안 됩니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Multi-limb 덧셈은 낮은 limb에서 생긴 carry를 다음 limb로 전달합니다. EVM arithmetic은 256-bit modulo가 필요한 곳이 있지만
          balance 합산·length 계산처럼 overflow를 오류로 봐야 하는 경계도 있으므로 함수 이름만이 아니라 호출 목적을 확인합니다.
        </p>
      </div>
    </section>
  );
}
