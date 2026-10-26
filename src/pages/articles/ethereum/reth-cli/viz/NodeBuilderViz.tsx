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
      eyebrow="형식 상태 · 조립 순서"
      title="현재 빌더의 형식이 다음에 할 수 있는 조작을 제한합니다"
      description="실행 중 플래그 하나로 검사하지 않고, 조립 단계마다 다른 Rust 형식이 다음 메서드와 조건을 노출합니다."
    >
      <RethFlow>
        <RethStep
          index="S0"
          title="NodeBuilder"
          body="NodeConfig와 실행 문맥을 준비합니다. 아직 핵심 부품은 없습니다."
        />
        <RethStep
          index="S1"
          title="WithTypes"
          body="체인 값 형식과 조회 계층 형식을 고정합니다. 아직 실행할 수 없습니다."
        />
        <RethStep
          index="S2"
          title="WithComponents"
          body="거래 풀·네트워크·실행기·페이로드 빌더의 호환 조합을 연결합니다."
        />
        <RethStep
          index="S3"
          title="WithAddOns"
          body="RPC·Engine 검증기·ExEx와 훅을 붙인 뒤 실행기로 넘깁니다."
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
