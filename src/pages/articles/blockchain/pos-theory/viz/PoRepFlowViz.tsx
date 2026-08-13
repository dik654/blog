import { DistributedFrame, Flow } from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function PoRepFlowViz() {
  return (
    <DistributedFrame
      eyebrow="PoRep sealing"
      title="같은 data를 replica identity마다 다른 committed encoding으로 만든다"
      description="Filecoin의 sealing pipeline은 piece·sector data를 replica-specific encoding으로 바꾸고 data/replica commitments와 succinct proof를 network state에 연결합니다."
      note="‘독립 물리 disk’를 센서로 직접 검사하는 것은 아닙니다. Regeneration·deduplication 비용에 대한 claim은 선택한 PoRep construction의 sequentiality·space assumptions에 귀속합니다."
    >
      <Flow steps={[
        { label: "01 data", title: "Sector data commitment", body: "Padding·piece layout을 포함한 exact sector bytes와 CommD를 고정합니다." },
        { label: "02 identity", title: "Replica identity", body: "Provider·sector·ticket 등 protocol input으로 replica별 encoding context를 만듭니다." },
        { label: "03 encode", title: "Replica R 생성", body: "Construction의 graph·labeling rule로 D를 replica-specific R로 encoding합니다." },
        { label: "04 prove", title: "Commitment·proof 검증", body: "CommD·CommR과 proof가 같은 sector·replica inputs에 묶였는지 검증합니다." },
      ]} />
    </DistributedFrame>
  );
}
