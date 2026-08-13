import { DistributedFrame, Flow } from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function SafetyLivenessViz() {
  return (
    <DistributedFrame
      eyebrow="Certificate lifecycle"
      title="Safety evidence를 보존한 채 leader를 바꾼다"
      description="Timeout이 나면 아무 value나 다시 제안하지 않습니다. 새 leader는 이전 view의 가장 강한 certificate·lock evidence를 수집해 safe value를 이어받습니다."
      note="Pacemaker와 timeout은 liveness 장치입니다. 무엇이 safe proposal인지 정하는 lock·certificate rule을 우회할 권한은 없습니다."
    >
      <Flow steps={[
        { label: "01 lock", title: "Safe value를 잠금", body: "Replica가 protocol의 certificate 조건을 보고 local lock을 갱신합니다." },
        { label: "02 timeout", title: "Progress 부족 관찰", body: "Timeout certificate는 view를 옮길 근거이며 leader fault의 완전한 증명은 아닙니다." },
        { label: "03 view change", title: "Evidence 인계", body: "새 leader가 quorum의 highest safe certificate를 수집합니다." },
        { label: "04 resume", title: "GST 뒤 진행", body: "정직 leader와 bounded delay가 만나면 conflicting commit 없이 새 certificate를 만듭니다." },
      ]} />
    </DistributedFrame>
  );
}
