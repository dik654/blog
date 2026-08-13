import VizFrame from "@/components/viz/VizFrame";
import { CodeViewButton } from "@/components/code";
import { RethDecision, RethReceipt } from "../../reth-viz-primitives";

export default function BuilderDetailViz({
  onOpenCode,
}: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <VizFrame
      eyebrow="Compile-time gate"
      title="Builder state는 빠진 dependency를 launch 전에 드러냅니다"
      description="정확한 type 이름과 method는 release에 따라 바뀔 수 있지만, input type이 다음 단계의 capability를 제한한다는 계약은 유지됩니다."
    >
      <div className="grid min-w-0 gap-5 md:grid-cols-3">
        <RethReceipt label="input" value="NodeConfig<ChainSpec>" />
        <RethReceipt label="configured" value="Types + Components + AddOns" />
        <RethReceipt label="output" value="NodeHandle + service receipts" />
      </div>
      <div className="mt-6">
        <RethDecision
          question="필수 component와 add-on trait bound가 모두 만족되는가?"
          yes="Launch context가 database·provider를 열고 component builder를 호출합니다."
          no="해당 builder state에 launch method가 없거나 trait bound가 성립하지 않습니다."
        />
      </div>
      {onOpenCode && (
        <div className="mt-6 flex justify-end border-t border-border pt-4">
          <CodeViewButton onClick={() => onOpenCode("builder-states")} />
        </div>
      )}
    </VizFrame>
  );
}
