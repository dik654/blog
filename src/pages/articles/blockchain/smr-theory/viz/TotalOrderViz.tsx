import { DistributedFrame, Ledger } from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function TotalOrderViz() {
  return (
    <DistributedFrame
      eyebrow="DELIVERY CONTRACT"
      title="Total-order broadcast는 같은 message를 같은 순서로 deliver하게 한다"
      description="Network arrival order가 달라도 agreement·total order·integrity와 조건부 validity를 만족하는 delivery history를 만듭니다."
      note="Broadcast와 delivery는 다릅니다. Receive buffer에 도착한 message는 아직 protocol이 정한 log order로 deliver·commit된 것이 아닙니다."
    >
      <Ledger columns={4} items={[
        { label: "AGREE", title: "Agreement", body: "한 correct process가 deliver하면 correct process들이 결국 deliver합니다." },
        { label: "ORDER", title: "Total order", body: "둘을 deliver한 correct process는 모두 같은 상대 순서를 봅니다." },
        { label: "INTEGRITY", title: "Integrity", body: "Message를 중복 deliver하거나 없던 message를 만들지 않습니다." },
        { label: "VALID", title: "Validity", body: "Correct sender의 broadcast는 명시한 조건에서 결국 deliver됩니다." },
      ]} />
    </DistributedFrame>
  );
}
