import { DistributedFrame, Flow } from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function PaxosViz() {
  return (
    <DistributedFrame
      eyebrow="PAXOS SLOT"
      title="Promise가 더 낮은 proposal을 막고 quorum 교집합이 chosen value를 보존한다"
      description="새 proposer는 Prepare quorum에서 가장 높은 accepted proposal의 value를 이어받아 서로 다른 두 value가 chosen되는 것을 막습니다."
      note="한 slot의 Paxos safety와 Multi-Paxos의 leader·log·reconfiguration·client dedupe는 같은 문제가 아닙니다."
    >
      <Flow steps={[
        { label: "PREPARE", title: "번호 n 제안", body: "Proposer가 더 큰 proposal number로 quorum에 상태를 묻습니다." },
        { label: "PROMISE", title: "낮은 번호 거절", body: "Acceptor는 앞으로 n보다 낮은 proposal을 accept하지 않겠다고 약속합니다." },
        { label: "ADOPT", title: "기존 value 보존", body: "응답 중 가장 높은 accepted proposal의 value가 있으면 이어받습니다." },
        { label: "ACCEPT", title: "Quorum chosen", body: "Accept quorum이 같은 proposal을 기록하면 value가 chosen됩니다." },
      ]} />
    </DistributedFrame>
  );
}
