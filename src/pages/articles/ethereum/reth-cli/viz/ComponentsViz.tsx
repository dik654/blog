import VizFrame from "@/components/viz/VizFrame";
import { CodeViewButton } from "@/components/code";
import { RethFlow, RethStep } from "../../reth-viz-primitives";

export default function ComponentsViz({
  onOpenCode,
}: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <VizFrame
      eyebrow="Dependency-aware composition"
      title="Component는 독립 목록이 아니라 output type이 다음 builder의 input이 되는 DAG입니다"
      description="Pool을 바꾸면 network·payload가 요구하는 transaction type constraint도 다시 만족해야 합니다."
    >
      <RethFlow>
        <RethStep
          index="01"
          title="Executor"
          body="ChainSpec과 EVM rule로 block transition을 실행합니다."
        />
        <RethStep
          index="02"
          title="Transaction pool"
          body="Validated transaction type과 ordering policy를 제공합니다."
        />
        <RethStep
          index="03"
          title="Network·payload"
          body="Pool·provider output을 소비해 relay와 block building을 구성합니다."
        />
        <RethStep
          index="04"
          title="Add-ons"
          body="RPC·Engine validator·ExEx hook을 core lifecycle 경계에 붙입니다."
          accent
        />
      </RethFlow>
      {onOpenCode && (
        <div className="mt-6 flex justify-end border-t border-border pt-4">
          <CodeViewButton onClick={() => onOpenCode("node-components")} />
        </div>
      )}
    </VizFrame>
  );
}
