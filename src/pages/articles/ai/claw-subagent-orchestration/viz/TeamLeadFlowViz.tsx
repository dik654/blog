import {
  OrchestrationFrame,
  OrchestrationRule,
  OrchestrationSteps,
} from "./OrchestrationVizPrimitives";

export default function TeamLeadFlowViz() {
  return (
    <OrchestrationFrame
      label="OWNERSHIP"
      title="목표·작업 그래프·산출물의 owner를 분리한다"
      description="각 계층은 다른 상태와 종료 조건을 소유하며 같은 계획을 중복해서 만들지 않습니다."
      note="worker가 적고 dependency가 단순하면 coordinator layer를 생략할 수 있습니다."
    >
      <OrchestrationSteps
        columns={3}
        items={[
          {
            label: "GOAL",
            title: "Main agent",
            body: "사용자 목표와 최종 통합 판단을 유지합니다.",
            tone: "blue",
          },
          {
            label: "GRAPH",
            title: "Coordinator",
            body: "dependency, ownership, retry와 cancellation을 관리합니다.",
            tone: "violet",
          },
          {
            label: "ARTIFACT",
            title: "Worker",
            body: "한 contract를 수행하고 evidence와 함께 반환합니다.",
            tone: "emerald",
          },
        ]}
      />
      <OrchestrationRule>
        handoff에는 목표, scope, capability, expected artifact와 verifier가 함께
        이동합니다.
      </OrchestrationRule>
    </OrchestrationFrame>
  );
}
