import { DistributedFrame, Ledger } from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function FaultyThresholdViz() {
  return (
    <DistributedFrame
      eyebrow="Quorum arithmetic"
      title="n=4, f=1이면 certificate 3개와 honest overlap 1개가 필요하다"
      description="서로 다른 두 certificate가 각각 3표라면 최소 2표가 겹칩니다. Byzantine은 최대 1명이므로 겹친 signer 중 적어도 1명은 honest입니다."
      note="교집합만으로 safety가 완성되지는 않습니다. Honest signer가 conflicting certificate에 참여하지 않게 하는 phase·lock·signing rule이 함께 필요합니다."
    >
      <Ledger columns={2} items={[
        { label: "Qx", title: "x certificate", body: "Signers {A,B,C}가 x에 투표했다고 가정합니다.", example: "|Qx|=3" },
        { label: "Qy", title: "y certificate", body: "Signers {B,C,D}가 y에 투표했다고 가정합니다.", example: "|Qy|=3" },
        { label: "intersection", title: "두 signer가 겹침", body: "{B,C} 두 명이 양쪽 certificate에 포함됩니다.", example: "3+3−4=2=f+1" },
        { label: "honest overlap", title: "최소 한 명은 honest", body: "Fault가 최대 한 명이므로 B·C가 모두 Byzantine일 수 없습니다.", example: "honest signer refuses conflict" },
      ]} />
    </DistributedFrame>
  );
}
