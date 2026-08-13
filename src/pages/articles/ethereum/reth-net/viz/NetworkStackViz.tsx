import VizFrame from "@/components/viz/VizFrame";
import { RethReceipt } from "../../reth-viz-primitives";

export default function NetworkStackViz() {
  return (
    <VizFrame
      eyebrow="Connection receipt"
      title="Active session은 address가 아니라 phase별 검증 결과의 묶음입니다"
      description="장애가 나면 마지막 성공 phase와 원인을 남겨 retry·ban·slot 회수를 다르게 결정합니다."
    >
      <div className="grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <RethReceipt
          label="candidate"
          value="node_id + endpoint + record_seq"
        />
        <RethReceipt label="transport" value="direction + local/remote addr" />
        <RethReceipt
          label="RLPx"
          value="authenticated peer + shared capabilities"
        />
        <RethReceipt label="ETH" value="version + fork_id + head + status" />
      </div>
    </VizFrame>
  );
}
