import { useState } from "react";
import { CodeViewButton } from "@/components/code";
import EffectiveTipViz from "./viz/EffectiveTipViz";
import { ORDERING_BOUNDARIES, TIP_CASES } from "./EffectiveTipData";
import { codeRefs } from "./codeRefs";
import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";

export default function EffectiveTip({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);

  return (
    <section id="effective-tip" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        effective tip은 fee cap 안의 beneficiary 몫
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Dynamic-fee transaction의 effective tip은{" "}
          <code>min(max_priority_fee, max_fee - base_fee)</code>입니다. max
          fee가 current base fee보다 작으면 subtraction을 강행하지 않고 이 block
          문맥에서 실행할 수 없는 결과를 반환합니다. Legacy transaction도 London
          이후에는 gas price에서 base fee를 뺀 나머지가 tip이 됩니다.
        </p>
        <p className="leading-7">
          이 값은 block beneficiary에게 돌아갈 per-gas value를 비교하는 데
          쓰이지만, “tip 내림차순이 곧 block 순서”는 아닙니다. sender nonce
          dependencies, transaction validity, execution gas·blob gas budgets와
          builder policy를 함께 적용해야 합니다. 고정 gwei 시세나 MEV 유형별
          숫자는 protocol invariant가 아니므로 설명에서 분리합니다.
        </p>
      </div>

      <div className="not-prose mb-8">
        <EffectiveTipViz />
      </div>

      <ExplainedFormula
        question="Alice가 실제로 낸 금액 중 얼마가 burn되고 얼마가 proposer에게 갈까?"
        idea="Fee cap은 총 per-gas 가격의 상한이고 priority cap은 tip의 상한입니다. 먼저 두 상한 안에서 유효 tip을 정한 뒤 실제 gas used를 곱해 burn과 tip을 분리합니다."
        formula={String.raw`\begin{aligned}P_e&=\min(P_m,F_m-B)\\&=3\ \mathrm{gwei/gas}\\[2pt]C_b&=BU\\&=512{,}500\ \mathrm{gwei}\\[2pt]C_t&=P_eU\\&=75{,}000\ \mathrm{gwei}\\[2pt]C&=C_b+C_t\\&=587{,}500\ \mathrm{gwei}\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}P_e&=\underbrace{\min(P_m,F_m-B)}_{\text{경계 후보 선택}}\\&=\underbrace{3\ \mathrm{gwei/gas}}_{\text{기준량당 비율}}\\[2pt]C_b&=\underbrace{BU}_{\text{Execution fee 계산}}\\&=512{,}500\ \mathrm{gwei}\\[2pt]C_t&=P_eU\\&=75{,}000\ \mathrm{gwei}\\[2pt]C&=C_b+C_t\\&=587{,}500\ \mathrm{gwei}\end{aligned}`}
        operations={[
          { expression: String.raw`\min(P_m,F_m-B)`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","Fee cap은 총 per-gas 가격의 상한이고","priority cap은 tip의 상한입니다."] },
          { expression: String.raw`3\ \mathrm{gwei/gas}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Fee cap은 총 per-gas 가격의 상한이고","priority cap은 tip의 상한입니다."] },
          { expression: String.raw`BU`, annotation: ["Execution fee이(가) 식의 결과에 기여하는 방식을","계산합니다.","Fee cap은 총 per-gas 가격의 상한이고","priority cap은 tip의 상한입니다."] },
        ]}
        terms={[
          { symbol: "F_m", name: "Max fee cap", description: "Sender가 허용한 총 가격 상한입니다. 예시는 40 gwei/gas입니다." },
          { symbol: "P_m", name: "Priority fee cap", description: "Sender가 허용한 tip 상한이며 예시는 3 gwei/gas입니다." },
          { symbol: "B", name: "Current base fee", description: "현재 block의 합의 가격이며 예시는 20.5 gwei/gas입니다." },
          { symbol: "P_e", name: "Effective tip", description: "두 cap을 모두 만족해 beneficiary에 귀속되는 실제 tip입니다." },
          { symbol: "U", name: "Transaction gas used", description: "Receipt에서 확정되는 실제 사용량입니다. 예시는 25,000 gas입니다." },
          { symbol: "C", name: "Execution fee", description: "Refund 이후 실제 gas used에 대한 총 수수료입니다. 단위는 gwei입니다." },
          { symbol: "C_b, C_t", name: "Burn·tip 금액", description: "각각 protocol이 burn하는 base-fee 금액과 beneficiary에게 귀속되는 tip입니다." },
        ]}
        assumptions={[
          "Transaction의 max fee가 current base fee 이상이라 이 block에서 fee-eligible합니다.",
          "Blob gas fee와 value transfer는 이 execution-gas 예시에서 제외합니다.",
          "Tip만으로 block 포함 순서가 정해지지 않으며 sender nonce와 builder constraints가 남습니다.",
        ]}
        interpretation="Alice는 587,500 gwei(0.0005875 ETH)를 내고 그중 512,500 gwei는 burn, 75,000 gwei는 beneficiary 몫입니다. Max fee 40 gwei 전부를 내는 것이 아니라 현재 base fee와 유효 tip의 합만 냅니다."
      />

      <h3 className="text-lg font-semibold mb-3">fee-cap 관계별 결과</h3>
      <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-2 mb-8">
        {TIP_CASES.map((item, index) => (
          <button
            type="button"
            key={item.type}
            onClick={() => setActive(index)}
            className={`cursor-pointer rounded-xl border p-4 text-left ${active === index ? "bg-muted/50" : "border-border"}`}
            style={{ borderColor: active === index ? item.color : undefined }}
          >
            <p className="text-sm font-bold" style={{ color: item.color }}>
              {item.type}
            </p>
            <code className="mt-2 block text-xs text-foreground/55">
              {item.expression}
            </code>
            <p className="mt-2 text-xs leading-5 text-foreground/65">
              {item.result}
            </p>
          </button>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-3">
        txpool·payload builder와의 경계
      </h3>
      <ul className="not-prose mb-8 space-y-2">
        {ORDERING_BOUNDARIES.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-border/60 p-3 text-sm leading-6 text-foreground/70"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() => onCodeRef("effective-tip", codeRefs["effective-tip"])}
        />
        <span className="self-center text-xs text-muted-foreground">
          effective_tip_per_gas snapshot
        </span>
      </div>
    </section>
  );
}
