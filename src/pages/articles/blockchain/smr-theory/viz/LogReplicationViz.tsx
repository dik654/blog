import { DistributedFrame, Flow } from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function LogReplicationViz() {
  return (
    <DistributedFrame
      eyebrow="RAFT PATH"
      title="Append와 commit, apply는 서로 다른 상태다"
      description="Leader가 entry를 local log에 썼다는 사실만으로 client success를 반환하지 않고 current term의 entry가 quorum에 복제된 뒤 commit index를 전진합니다."
      note="Follower disk write·network ACK·leader commit·state-machine apply의 crash cut을 따로 주입해야 recovery와 응답 경계를 검증할 수 있습니다."
    >
      <Flow steps={[
        { label: "01", title: "Append", body: "Leader가 term·index·command entry를 local durable log에 기록합니다." },
        { label: "02", title: "Replicate", body: "Follower가 prevLogTerm·prevLogIndex를 확인하고 append ACK를 보냅니다." },
        { label: "03", title: "Commit", body: "Current-term entry가 majority에 있으면 leader commit index를 전진합니다." },
        { label: "04", title: "Apply", body: "각 replica가 committed prefix를 순서대로 state machine에 반영합니다." },
      ]} />
    </DistributedFrame>
  );
}
