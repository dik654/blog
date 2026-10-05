import {
  OrchestrationFrame,
  OrchestrationRule,
  OrchestrationSteps,
} from "./OrchestrationVizPrimitives";

export default function TeamLeadFlowViz() {
  return (
    <OrchestrationFrame
      label="OWNERSHIP"
      title="로그인 401 작업의 목표·dependency·산출물 owner를 분리합니다"
      description="같은 auth.ts를 여러 주체가 동시에 고치게 하지 않고, 원인 evidence가 나온 뒤 한 owner가 patch와 test를 만듭니다."
      note="작업이 두 개뿐이면 main이 graph를 직접 관리해 coordinator를 생략할 수 있습니다. 계층 수보다 ownership·dependency·verifier가 실제 runtime에서 지켜지는지가 중요합니다."
    >
      <OrchestrationSteps
        compactMobile
        columns={3}
        items={[
          {
            label: "GOAL",
            title: "Main agent",
            body: "‘401 최소 수정 + deterministic test 통과’라는 사용자 완료 조건과 최종 통합 판단을 유지합니다.",
            tone: "blue",
          },
          {
            label: "GRAPH",
            title: "Coordinator",
            body: "읽기 전용 auth trace → 단일-owner patch·test 순서를 정하고 auth.ts ownership·취소를 관리합니다.",
            tone: "violet",
          },
          {
            label: "ARTIFACT",
            title: "Worker",
            body: "원인 조사는 file·line evidence를, 구현은 격리된 diff와 실제 test receipt를 반환합니다.",
            tone: "emerald",
          },
        ]}
      />
      <OrchestrationRule>
        “완료”라는 문장은 artifact가 아닙니다. Main은 evidence와 diff를 읽고 같은
        fixture의 verifier를 확인한 뒤에만 사용자 목표에 통합합니다.
      </OrchestrationRule>
    </OrchestrationFrame>
  );
}
