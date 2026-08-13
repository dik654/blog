import VizFrame from "@/components/viz/VizFrame";
import { CodeViewButton } from "@/components/code";
import { RethDecision, RethReceipt } from "../../reth-viz-primitives";

export default function HardforkDetailViz({
  onOpenCode,
}: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <VizFrame
      eyebrow="Activation predicate"
      title="Fork 이름을 block context와 condition에 넣어 active 여부를 계산합니다"
      description="Block number와 timestamp를 서로 대신 쓰지 않으며, TTD와 Never도 별도 branch로 보존합니다."
    >
      <div className="grid min-w-0 gap-5 md:grid-cols-3">
        <RethReceipt label="fork" value="F = Prague" />
        <RethReceipt label="condition" value="Timestamp(T_f)" />
        <RethReceipt
          label="context"
          value="number, timestamp, total_difficulty"
        />
      </div>
      <div className="mt-6">
        <RethDecision
          question="현재 context가 해당 ForkCondition을 만족하는가?"
          yes="Validator·EVM·payload builder가 새 rule set을 선택합니다."
          no="이전 rule set을 유지하며 future fork를 현재 block에 적용하지 않습니다."
        />
      </div>
      {onOpenCode && (
        <div className="mt-6 flex justify-end border-t border-border pt-4">
          <CodeViewButton onClick={() => onOpenCode("fork-condition")} />
        </div>
      )}
    </VizFrame>
  );
}
