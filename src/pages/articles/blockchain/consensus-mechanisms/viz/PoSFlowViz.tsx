import {
  DistributedFrame,
  Flow,
} from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function PoSFlowViz() {
  return (
    <DistributedFrame
      eyebrow="PoS lifecycle"
      title="Proposal·fork choice·finality·slashing evidence가 이어진다"
      description="Stake deposit만으로 합의가 끝나지 않습니다. Validator message의 대상·source·target checkpoint와 서명을 검증해야 합니다."
      note="세부 epoch·slot·threshold는 protocol version의 정본 규격에서 확인합니다. 여기서는 역할 경계만 일반화합니다."
    >
      <Flow
        steps={[
          { label: "01 bond", title: "Stake와 key 등록", body: "경제적 담보와 서명 identity가 protocol state에 들어갑니다." },
          { label: "02 propose", title: "Block 후보 제안", body: "선택된 proposer가 parent·state transition이 포함된 block을 전파합니다." },
          { label: "03 attest", title: "Head와 checkpoint 투표", body: "다른 validator가 valid block·fork choice·finality 대상에 서명합니다." },
          { label: "04 settle", title: "Finalize 또는 증거 처리", body: "충분한 weight의 일관된 vote는 checkpoint를 확정하고, 모순 서명은 slashing evidence가 됩니다." },
        ]}
      />
    </DistributedFrame>
  );
}
