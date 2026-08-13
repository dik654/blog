import { useState } from "react";
import ContextViz from "./viz/ContextViz";
import BaseFeeViz from "./viz/BaseFeeViz";
import { DESIGN_CHOICES, FEE_COMPONENTS } from "./OverviewData";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [selected, setSelected] = useState(0);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        EIP-1559는 다음 block 가격을 합의로 계산한다
      </h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          EIP-1559는 block-wide base fee와 sender가 제시하는 fee cap·priority
          fee를 분리합니다. base fee는 parent header의 gas used, gas limit와
          활성 chain parameters로 다음 block 값을 결정하고 burn됩니다. priority
          fee는 transaction cap이 허용하는 범위에서 block beneficiary에
          돌아갑니다.
        </p>
        <p className="leading-7">
          Mainnet의 London rules는 elasticity multiplier와 change denominator를
          사용하지만, 구현은 숫자를 UI 여러 곳에 복사하지 않고 ChainSpec에서
          활성 parameters를 가져와야 합니다. consensus에서 중요한 것은 widened
          integer multiplication, division 순서, rounding과 increase branch의
          최소 1 wei 규칙입니다.
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-3 mb-4">
        {DESIGN_CHOICES.map((item, index) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setSelected(index)}
            className={`cursor-pointer rounded-xl border p-4 text-left ${selected === index ? "bg-muted/50" : "border-border"}`}
            style={{ borderColor: selected === index ? item.color : undefined }}
          >
            <p className="text-sm font-bold" style={{ color: item.color }}>
              {item.title}
            </p>
          </button>
        ))}
      </div>
      <div className="not-prose mb-8 rounded-xl border border-border/60 p-4">
        <p className="text-sm leading-6 text-foreground/65">
          <strong>문제:</strong> {DESIGN_CHOICES[selected].problem}
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground/80">
          <strong>구현:</strong> {DESIGN_CHOICES[selected].solution}
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">수수료의 세 경계</h3>
      <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-3 mb-8">
        {FEE_COMPONENTS.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border/60 p-4"
            style={{ borderLeftWidth: 3, borderLeftColor: item.color }}
          >
            <p
              className="font-mono text-sm font-bold"
              style={{ color: item.color }}
            >
              {item.label}
            </p>
            <p className="mt-2 text-xs leading-5 text-foreground/60">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="not-prose">
        <BaseFeeViz />
      </div>
    </section>
  );
}
