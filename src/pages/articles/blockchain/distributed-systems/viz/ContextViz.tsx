import { DistributedFrame, Flow } from "./DistributedVizPrimitives";

export default function ContextViz() {
  return (
    <DistributedFrame
      eyebrow="TOP-DOWN MAP"
      title="복제본이 갈라지는 원인부터, 합의가 필요한 지점까지"
      description="노드마다 관측 순서가 달라지므로 protocol은 먼저 가정과 실패를 선언한 뒤 안전성과 진행 조건을 설계합니다."
      note="합의는 모든 노드를 항상 같은 순간에 만드는 기능이 아니라, 허용한 실행과 장애 범위에서 서로 모순된 결정을 막고 결국 진행시키는 계약입니다."
    >
      <Flow
        steps={[
          { label: "INPUT", title: "서로 다른 관측", body: "요청과 메시지가 노드마다 다른 시각·순서로 도착합니다." },
          { label: "MODEL", title: "가정 선언", body: "지연, channel, clock, crash·Byzantine 범위를 고정합니다." },
          { label: "PROTOCOL", title: "증거 교환", body: "vote·quorum·timeout으로 어떤 상태를 채택할지 정합니다." },
          { label: "OUTPUT", title: "검증 가능한 결정", body: "safety는 충돌을 막고 liveness는 조건이 회복되면 진행합니다." },
        ]}
      />
    </DistributedFrame>
  );
}
