import { useState } from "react";
import { CodeViewButton } from "@/components/code";
import EffectiveTipViz from "./viz/EffectiveTipViz";
import { ORDERING_BOUNDARIES, TIP_CASES } from "./EffectiveTipData";
import { codeRefs } from "./codeRefs";
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
