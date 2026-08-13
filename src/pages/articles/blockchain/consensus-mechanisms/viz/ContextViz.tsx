import {
  DistributedFrame,
  Flow,
} from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function ContextViz() {
  return (
    <DistributedFrame
      eyebrow="진입 지도"
      title="합의 메커니즘은 세 질문을 함께 푼다"
      description="누가 제안할 수 있는지, 충돌한 기록을 어떻게 고르는지, 언제 되돌릴 수 없다고 판단하는지는 서로 다른 계약입니다."
      note="PoW와 PoS는 Sybil resistance를 제공하지만, 실행 결정론·네트워크 가용성·애플리케이션 보안까지 대신하지는 않습니다."
    >
      <Flow
        steps={[
          { label: "01 membership", title: "영향력의 비용", body: "PoW는 계산 자원, PoS는 잠긴 stake로 가짜 정체성의 표 수를 제한합니다." },
          { label: "02 proposal", title: "후보 제안", body: "Hash target 당첨자나 stake-weighted proposer가 새 block 후보를 만듭니다." },
          { label: "03 fork choice", title: "충돌 선택", body: "동시에 보인 여러 branch 가운데 protocol rule로 canonical head를 고릅니다." },
          { label: "04 finality", title: "되돌림 경계", body: "추가 work로 확률을 낮추거나, stake vote로 명시적인 checkpoint를 확정합니다." },
        ]}
      />
    </DistributedFrame>
  );
}
