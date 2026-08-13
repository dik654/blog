import VizFrame from "@/components/viz/VizFrame";
import { RethDecision, RethReceipt } from "../../reth-viz-primitives";

export default function SessionDetailViz() {
  return (
    <VizFrame
      eyebrow="Session promotion"
      title="Socket open과 protocol ready 사이를 pending state로 보존합니다"
      description="각 timeout·decode·identity·fork mismatch는 다른 metric과 reputation input으로 남습니다."
    >
      <div className="grid min-w-0 gap-5 md:grid-cols-3">
        <RethReceipt label="pending" value="transport + handshake deadline" />
        <RethReceipt label="negotiated" value="peer_id + capability/version" />
        <RethReceipt
          label="ready"
          value="compatible Status + bounded channels"
        />
      </div>
      <div className="mt-6">
        <RethDecision
          question="Identity·capability·ETH Status와 local peer policy가 모두 통과했는가?"
          yes="Active slot을 부여하고 request·response·gossip handler에 연결합니다."
          no="Reason-coded close 후 slot·buffer를 회수하고 retry 또는 reputation 정책을 적용합니다."
        />
      </div>
    </VizFrame>
  );
}
