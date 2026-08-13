import { DistributedFrame, Flow } from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function ContextViz() {
  return (
    <DistributedFrame
      eyebrow="TOP-DOWN MAP"
      title="SMR은 같은 명령 집합을 같은 순서로 결정해 같은 상태를 만든다"
      description="Client request를 곧바로 여러 replica에서 실행하지 않고 log position을 먼저 합의한 뒤 deterministic state machine에 적용합니다."
      note="Log 복제는 external side effect를 자동으로 exactly-once로 만들지 않습니다. Client request ID와 effect receipt가 별도로 필요합니다."
    >
      <Flow steps={[
        { label: "REQUEST", title: "명령 제안", body: "Client가 stable request ID와 command를 보냅니다." },
        { label: "ORDER", title: "Log 위치 결정", body: "Consensus가 term·index와 chosen command를 고정합니다." },
        { label: "APPLY", title: "순서대로 실행", body: "Replica가 같은 prefix를 deterministic하게 apply합니다." },
        { label: "REPLY", title: "결과와 receipt", body: "Committed result와 중복 요청 상태를 client에 돌려줍니다." },
      ]} />
    </DistributedFrame>
  );
}
