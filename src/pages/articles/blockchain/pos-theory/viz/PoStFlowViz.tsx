import { DistributedFrame, Ledger } from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function PoStFlowViz() {
  return (
    <DistributedFrame
      eyebrow="PoSt evidence ledger"
      title="시간은 한 timestamp가 아니라 연속 proving obligations로 증명한다"
      description="각 window에서 randomness·challenged sectors·proof·deadline·verification result를 receipt로 남겨 기간 전체의 obligation 상태를 계산합니다."
      note="한 window의 성공이 미래 availability를 보장하지 않고, missed proof의 경제적 결과는 network version의 actor·policy 규칙에 귀속합니다."
    >
      <Ledger columns={4} items={[
        { label: "t₁", title: "Randomness 고정", body: "Domain-separated chain randomness와 eligible sector snapshot을 receipt에 남깁니다.", example: "challenge_id=c1" },
        { label: "t₂", title: "Sector openings", body: "선택된 sealed-sector commitments에 대한 response를 계산합니다.", example: "sector set S₂" },
        { label: "t₃", title: "Proof 검증", body: "Proof bytes·version·deadline·membership state를 같은 input으로 검증합니다.", example: "verified / invalid / missing" },
        { label: "t₄", title: "Lifecycle 갱신", body: "Accepted power·fault·recovery state를 protocol rule에 따라 갱신합니다.", example: "state transition receipt" },
      ]} />
    </DistributedFrame>
  );
}
