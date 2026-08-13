import VizFrame from "@/components/viz/VizFrame";
import { RethFlow, RethStep } from "../../reth-viz-primitives";

export default function ContextViz() {
  return (
    <VizFrame
      eyebrow="CLI boundary"
      title="문자열 옵션은 검증된 NodeConfig가 된 뒤에만 node assembly로 넘어갑니다"
      description="설정 source와 precedence를 기록하고, launchable type이 될 때까지 dependency를 단계적으로 채웁니다."
      note="CLI parse 성공은 node health가 아닙니다. Storage open·component init·RPC bind·task supervision은 서로 다른 상태입니다."
    >
      <RethFlow>
        <RethStep
          index="01"
          title="parse"
          body="CLI·config file·default를 읽고 source를 보존합니다."
        />
        <RethStep
          index="02"
          title="normalize"
          body="Chain·path·port·JWT·pruning 값을 typed config로 검증합니다."
        />
        <RethStep
          index="03"
          title="assemble"
          body="Types→components→add-ons의 dependency를 type으로 채웁니다."
        />
        <RethStep
          index="04"
          title="launch"
          body="Service를 시작하고 handle·version·readiness receipt를 반환합니다."
          accent
        />
      </RethFlow>
    </VizFrame>
  );
}
