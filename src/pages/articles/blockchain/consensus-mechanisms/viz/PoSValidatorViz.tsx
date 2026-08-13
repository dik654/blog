import {
  DistributedFrame,
  Ledger,
} from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function PoSValidatorViz() {
  return (
    <DistributedFrame
      eyebrow="Stake weighting"
      title="Stake 비율은 장기 선택 확률이지 매 slot 당첨 보장이 아니다"
      description="검증 가능한 randomness와 protocol state가 proposer·committee를 정하고, attestation weight가 fork choice·finality 입력이 됩니다."
      note="Validator 수와 stake weight는 다릅니다. 한 운영자가 여러 validator key를 가져도 경제적 영향력은 protocol이 인정한 effective stake로 계산합니다."
    >
      <Ledger
        columns={4}
        items={[
          { label: "A", title: "Stake 10", body: "전체 100 중 10의 weight를 가집니다.", example: "P(select)=0.10" },
          { label: "B", title: "Stake 20", body: "A보다 두 배의 장기 선택 확률을 가집니다.", example: "P(select)=0.20" },
          { label: "C", title: "Stake 30", body: "한 번의 slot에서는 선택되지 않을 수도 있습니다.", example: "P(select)=0.30" },
          { label: "D", title: "Stake 40", body: "가장 크지만 매 slot의 proposer가 되는 것은 아닙니다.", example: "P(select)=0.40" },
        ]}
      />
    </DistributedFrame>
  );
}
