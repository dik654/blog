import VizFrame from "@/components/viz/VizFrame";
import { CodeViewButton } from "@/components/code";
import { RethFlow, RethStep } from "../../reth-viz-primitives";

export default function NodeBuilderViz({
  onOpenCode,
}: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <VizFrame
      eyebrow="Typestate path"
      title="사용 가능한 method 집합이 assembly state를 증명합니다"
      description="Runtime flag 하나가 아니라 서로 다른 builder type이 다음에 허용할 조작을 제한합니다."
    >
      <RethFlow>
        <RethStep
          index="S0"
          title="NodeBuilder"
          body="NodeConfig와 launch context를 준비합니다. 아직 component가 없습니다."
        />
        <RethStep
          index="S1"
          title="WithTypes"
          body="Chain primitive·provider type을 고정합니다. launch는 아직 불가능합니다."
        />
        <RethStep
          index="S2"
          title="WithComponents"
          body="Pool·network·executor·payload builder의 호환 조합을 연결합니다."
        />
        <RethStep
          index="S3"
          title="WithAddOns"
          body="RPC·Engine validator·ExEx와 hook을 붙인 뒤 launcher로 넘깁니다."
          accent
        />
      </RethFlow>
      {onOpenCode && (
        <div className="mt-6 flex justify-end border-t border-border pt-4">
          <CodeViewButton onClick={() => onOpenCode("builder-node")} />
        </div>
      )}
    </VizFrame>
  );
}
