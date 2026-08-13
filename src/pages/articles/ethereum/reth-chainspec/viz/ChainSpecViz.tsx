import VizFrame from "@/components/viz/VizFrame";
import { CodeViewButton } from "@/components/code";
import { RethReceipt } from "../../reth-viz-primitives";

export default function ChainSpecViz({
  onOpenCode,
}: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <VizFrame
      eyebrow="Versioned rule bundle"
      title="모든 consumer가 같은 ChainSpec digest와 block context를 receipt로 남깁니다"
      description="이 묶음이 갈라지면 boundary block에서 서로 다른 header·gas·blob rule을 선택할 수 있습니다."
    >
      <div className="grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <RethReceipt label="identity" value="chain_id + genesis_hash" />
        <RethReceipt label="forks" value="ordered (fork, condition)" />
        <RethReceipt label="parameters" value="fee + blob + EVM limits" />
        <RethReceipt label="provenance" value="semver/SHA + spec_digest" />
      </div>
      {onOpenCode && (
        <div className="mt-6 flex justify-end border-t border-border pt-4">
          <CodeViewButton onClick={() => onOpenCode("chainspec-struct")} />
        </div>
      )}
    </VizFrame>
  );
}
