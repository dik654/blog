import VizFrame from "@/components/viz/VizFrame";
import { CodeViewButton } from "@/components/code";
import { RethFlow, RethStep } from "../../reth-viz-primitives";

export default function GenesisViz({
  onOpenCode,
}: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <VizFrame
      eyebrow="Genesis derivation"
      title="선언 파일은 state root와 sealed header hash를 거쳐 chain identity가 됩니다"
      description="Alloc byte 하나나 genesis-active fork 하나가 바뀌어도 root·header·genesis hash가 연쇄적으로 달라집니다."
    >
      <RethFlow>
        <RethStep
          index="01"
          title="Parse"
          body="Config·alloc·header fields를 canonical internal type으로 읽습니다."
        />
        <RethStep
          index="02"
          title="Build state"
          body="Account·code·storage를 trie key/value로 바꿔 state root를 계산합니다."
        />
        <RethStep
          index="03"
          title="Build header"
          body="Genesis-active fork가 요구하는 조건부 field를 채웁니다."
        />
        <RethStep
          index="04"
          title="Seal"
          body="Canonical header hash를 계산해 expected identity와 비교합니다."
          accent
        />
      </RethFlow>
      {onOpenCode && (
        <div className="mt-6 flex justify-end border-t border-border pt-4">
          <CodeViewButton onClick={() => onOpenCode("make-genesis")} />
        </div>
      )}
    </VizFrame>
  );
}
