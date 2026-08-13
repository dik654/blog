import { DistributedFrame, Flow } from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function ContextViz() {
  return (
    <DistributedFrame
      eyebrow="BFT trace"
      title="서로 다른 말을 하는 replica 사이에서도 한 log만 commit한다"
      description="Authenticated message는 누가 서명했는지 보여주지만 signer가 정직하다는 뜻은 아닙니다. Protocol은 conflicting vote를 견디는 quorum·lock·view change를 사용합니다."
      note="이 글의 3f+1·2f+1 계산은 equal-weight, fixed-membership, partial-synchrony BFT의 공통 예입니다. 다른 timing·authentication·weight model에 그대로 복사하지 않습니다."
    >
      <Flow steps={[
        { label: "01 propose", title: "Leader가 value 제안", body: "View v와 height h를 포함한 signed proposal을 전파합니다." },
        { label: "02 vote", title: "Replica가 검증 후 투표", body: "같은 phase·height에서 conflicting value에 투표하지 않는 local rule을 지킵니다." },
        { label: "03 certify", title: "Quorum certificate", body: "2f+1개의 distinct valid vote가 value와 phase를 증명합니다." },
        { label: "04 commit", title: "Lock·commit rule", body: "Protocol별 certificate chain이 conflicting commit을 막고 view change에도 evidence를 넘깁니다." },
      ]} />
    </DistributedFrame>
  );
}
