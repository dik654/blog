import { DistributedFrame, Flow } from "./DistributedVizPrimitives";

export default function FLPViz() {
  return (
    <DistributedFrame
      eyebrow="FLP EXECUTION"
      title="Adversarial scheduler는 결정을 만드는 한 메시지를 계속 늦출 수 있다"
      description="완전 비동기 모델에서는 protocol이 crash와 delay를 구별할 수 없으며, 결정 직전의 bivalent 상태를 영원히 연장하는 admissible execution이 존재합니다."
      note="FLP는 모든 실행이 멈춘다는 뜻이 아닙니다. 결정적 protocol이 모든 admissible execution에서 termination을 보장할 수 없다는 존재 정리입니다."
    >
      <Flow
        steps={[
          { label: "C₀", title: "두 결과가 가능", body: "아직 0과 1 모두 reachable한 bivalent configuration입니다." },
          { label: "e₁", title: "Critical event 보류", body: "한 event가 결정을 고정하려 하면 scheduler가 다른 event를 먼저 둡니다." },
          { label: "C₁", title: "미결정 상태 유지", body: "Commuting event를 이용해 다시 bivalent configuration에 도달합니다." },
          { label: "∞", title: "종료 보장 실패", body: "메시지는 결국 전달돼도 결정을 계속 미루는 execution이 존재합니다." },
        ]}
      />
    </DistributedFrame>
  );
}
