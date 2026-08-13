import { DistributedFrame, Ledger } from "./DistributedVizPrimitives";

export default function ConsensusClassViz() {
  return (
    <DistributedFrame
      eyebrow="DESIGN CHOICE"
      title="불가능성 결과를 피하는 방법은 가정을 명시적으로 추가하는 것이다"
      description="실제 protocol은 정리를 무시하지 않고 timing·randomness·failure detector·문제 정의 중 무엇을 강화했는지 공개합니다."
      note="성능 수치만 비교하면 숨은 system model 차이를 놓칩니다. 같은 failure injection과 decision rule에서 safety violation·time-to-recover를 함께 측정해야 합니다."
    >
      <Ledger
        columns={4}
        items={[
          { label: "TIMING", title: "Partial synchrony", body: "GST 이후 delay bound가 성립할 때 timeout으로 leader를 교체합니다." },
          { label: "RANDOM", title: "Randomized choice", body: "모든 adversarial schedule에서 deterministic step만 고집하지 않습니다." },
          { label: "DETECT", title: "Failure detector", body: "의심의 completeness·accuracy를 별도 oracle 계약으로 둡니다." },
          { label: "WEAKEN", title: "문제·보장 조정", body: "Approximate agreement나 probabilistic termination처럼 목표를 바꿉니다." },
        ]}
      />
    </DistributedFrame>
  );
}
