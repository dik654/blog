import { DistributedFrame, Flow } from "./DistributedVizPrimitives";

export default function ContextViz() {
  return (
    <DistributedFrame
      eyebrow="전체 지도"
      title="서로 다른 관측에서 검증 가능한 결정까지"
      description="노드마다 메시지를 보는 순서가 다릅니다. 프로토콜은 허용할 지연과 고장을 먼저 정하고, 그 범위에서 충돌을 막고 진행할 조건을 설계합니다."
      note="합의는 모든 노드를 매 순간 같은 값으로 만드는 기능이 아닙니다. 허용한 실행 안에서 충돌한 결정을 막고, 조건이 회복되면 다음 결정으로 나아가게 하는 규칙입니다."
    >
      <Flow
        steps={[
          { label: "01 · 관측", title: "서로 다른 현재 상태", body: "요청과 메시지가 노드마다 다른 시각과 순서로 도착합니다." },
          { label: "02 · 전제", title: "허용할 상황", body: "지연, 채널, 시계, 중단과 임의 행동의 범위를 정합니다." },
          { label: "03 · 규칙", title: "결정 증거", body: "표, 정족수, 라운드로 어떤 상태를 채택할지 정합니다." },
          { label: "04 · 보장", title: "충돌 방지와 진행", body: "안전성은 충돌을 막고 진행성은 조건이 회복된 뒤 다음 결정을 만듭니다." },
        ]}
      />
    </DistributedFrame>
  );
}
