import { useState } from "react";
import ContextViz from "./viz/ContextViz";
import MEVFlowViz from "./viz/MEVFlowViz";
import { PBS_ROLES } from "./OverviewData";
import type { CodeRef } from "@/components/code/types";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

export default function Overview({
  onCodeRef,
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
      <ContentBoundary article="reth-mev" />
      <ExplainedFormula
        question="Proposer는 높은 bid를 보았을 때 어떤 후보를 선택해야 할까?"
        idea="Value만 비교하기 전에 slot·parent·proposer·fork schema·signature와 deadline을 통과한 후보 집합을 만듭니다. 유효한 external bid가 없거나 delivery 여유가 부족하면 준비된 local payload가 liveness fallback입니다."
        formula={String.raw`b^*=\arg\max_{b\in\mathcal V(t<t_d)} v(b)`}
        annotatedFormula={String.raw`b^*=\underbrace{\arg\max_{b\in\mathcal V(t<t_d)} v(b)}_{\text{경계 후보 선택}}`}
        operations={[
          { expression: String.raw`\arg\max_{b\in\mathcal V(t<t_d)} v(b)`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","Value만 비교하기 전에","slot·parent·proposer·fork","schema·signature와 deadline을 통과한 후보"] },
        ]}
        terms={[
          { symbol: "b", name: "Builder bid", description: "Signed header·value·builder identity를 포함한 external 후보입니다." },
          { symbol: "\\mathcal V", name: "Validated set", description: "Expected slot·parent·proposer·fork fields·signature·policy를 모두 통과한 후보 집합입니다." },
          { symbol: "t_d", name: "Decision deadline", description: "Blinded block 선택과 payload delivery 후 proposal에 필요한 end-to-end 마감입니다." },
          { symbol: "v(b)", name: "Bid value", description: "Bid가 proposer에게 약속한 consensus-denominated value입니다. 실제 지급·delivery는 별도 검증 대상입니다." },
          { symbol: "b^*", name: "선택 후보", description: "Deadline 안의 유효 집합에서 value가 가장 큰 bid입니다." },
        ]}
        assumptions={["Relay response를 신뢰하기 전에 signature와 request context를 검증합니다.", "Local payload readiness와 fallback cutoff를 별도로 유지합니다.", "Private bundle intake와 proposer-side Builder API를 같은 authentication surface로 합치지 않습니다."]}
        interpretation="5·7·9 ETH bid 중 9 ETH 후보가 wrong parent라면 유효 집합에서 빠져 7 ETH를 선택합니다. 7 ETH payload가 전달되지 않을 위험은 argmax가 해결하지 않으므로 deadline·relay health·local fallback이 필요합니다."
      />
      <div className="not-prose mb-8">
        <CodeViewButton
          label="mev-boost processBid()"
          onClick={() => onCodeRef("process-bid", codeRefs["process-bid"])}
        />
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
      <div id="paper-builder-specs" className="mt-8 scroll-mt-24">
        <CitationBlock citeKey={1} source="Ethereum Builder Specifications @ 78a5546d" href="https://github.com/ethereum/builder-specs/tree/78a5546d9d8253beabf7db8baf988a58abdec87f">
          <p>Validator registration, header bid, blinded block와 payload delivery의 proposer-builder protocol은 이 snapshot에 귀속합니다.</p>
        </CitationBlock>
      </div>
      <div id="paper-mev-boost-source" className="scroll-mt-24">
        <CitationBlock citeKey={2} type="code" source="Flashbots mev-boost source @ 203bb965" href="https://github.com/flashbots/mev-boost/tree/203bb9659eea613caefd198c67df4c6a8e6bf5d6">
          <p>Relay aggregation과 proposer middleware 구현 설명은 이 SHA에 고정하며, neutral relay·delivery·best-value를 보장하는 protocol 정리로 확대하지 않습니다.</p>
        </CitationBlock>
      </div>
      <div id="paper-rbuilder-source" className="scroll-mt-24">
        <CitationBlock citeKey={3} type="code" source="Flashbots rbuilder source @ 6037fa72" href="https://github.com/flashbots/rbuilder/tree/6037fa728b13bf1806e16fff2586414216f6b8fa">
          <p>Reth crates를 재사용하는 external builder의 구현 근거입니다. Reth node core의 local payload lifecycle과 동일한 owner로 해석하지 않습니다.</p>
        </CitationBlock>
      </div>
    </section>
  );
}
