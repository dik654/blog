import { useState } from "react";
import ContextViz from "./viz/ContextViz";
import MEVFlowViz from "./viz/MEVFlowViz";
import { PBS_ROLES } from "./OverviewData";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);
  const role = PBS_ROLES[active];

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        MEV 시장을 Reth 내부 기능으로 합치지 않기
      </h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Transaction ordering이 만드는 추가 가치는 arbitrage, liquidation,
          backrun과 harmful ordering까지 여러 전략을 낳습니다. 현재
          proposer-builder 시장에서는 searcher, external builder, relay와
          proposer-side middleware가 이를 나눠 처리하지만 이 전체를 execution
          client의 “MEV module”로 보면 책임이 뒤섞입니다.
        </p>
        <p className="leading-7">
          Reth node의 core 역할은 consensus client가 Engine API로 요청한 local
          execution payload를 유효하게 만드는 것입니다. mev-boost가 relay bids를
          받아 blinded block을 선택하는 경로는 validator·consensus-client 쪽에
          있고, rbuilder는 Reth의 crates와 provider를 재사용할 수 있는 별도
          builder application입니다.
        </p>
      </div>

      <div className="not-prose grid grid-cols-2 gap-2 sm:grid-cols-4 mb-4">
        {PBS_ROLES.map((item, index) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setActive(index)}
            className={`cursor-pointer rounded-xl border p-3 text-left ${active === index ? "bg-muted/50" : "border-border"}`}
            style={{ borderColor: active === index ? item.color : undefined }}
          >
            <p className="text-sm font-bold" style={{ color: item.color }}>
              {item.label}
            </p>
            <p className="mt-1 text-xs text-foreground/55">{item.role}</p>
          </button>
        ))}
      </div>
      <div className="not-prose mb-8 rounded-xl border border-border/60 p-4 text-sm leading-6 text-foreground/75">
        <strong>경계:</strong> {role.boundary}
      </div>

      <div className="not-prose">
        <MEVFlowViz />
      </div>
    </section>
  );
}
