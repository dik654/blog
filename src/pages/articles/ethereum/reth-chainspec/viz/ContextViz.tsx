import VizFrame from "@/components/viz/VizFrame";
import { RethFlow, RethStep } from "../../reth-viz-primitives";

export default function ContextViz() {
  return (
    <VizFrame
      eyebrow="Chain identity"
      title="Chain ID 하나가 아니라 genesis와 fork schedule을 묶어 실행 규칙을 고정합니다"
      description="같은 transaction bytes라도 어느 fork가 활성인지와 prior state가 다르면 validity와 execution result가 달라집니다."
    >
      <RethFlow>
        <RethStep
          index="01"
          title="Identity"
          body="Chain ID·genesis hash·network metadata를 고정합니다."
        />
        <RethStep
          index="02"
          title="Activation"
          body="Block·timestamp·TTD·Never 조건을 현재 context에 평가합니다."
        />
        <RethStep
          index="03"
          title="Parameters"
          body="Base fee·blob·EVM rule을 active fork에서 선택합니다."
        />
        <RethStep
          index="04"
          title="Consumers"
          body="Validator·executor·payload·network가 같은 decision을 사용합니다."
          accent
        />
      </RethFlow>
    </VizFrame>
  );
}
