import {
  OrchestrationFrame,
  OrchestrationRule,
  OrchestrationSteps,
} from "./OrchestrationVizPrimitives";

export default function GuardrailsViz() {
  return (
    <OrchestrationFrame
      label="RUNTIME GUARDRAILS"
      title="계약을 실행 제약과 검증으로 바꾼다"
      description="prompt는 방향을 설명하고 runtime은 budget, capability, topology와 종료 상태를 강제합니다."
      note="취소와 종료에는 process, credential, writable workspace 회수가 포함됩니다."
    >
      <OrchestrationSteps
        items={[
          {
            label: "BUDGET",
            title: "Time · token · cost",
            body: "상한을 넘으면 partial 상태로 중단합니다.",
            tone: "amber",
          },
          {
            label: "ACCESS",
            title: "Least capability",
            body: "tool뿐 아니라 path와 network 범위를 제한합니다.",
            tone: "rose",
          },
          {
            label: "SHAPE",
            title: "Depth · concurrency",
            body: "spawn 폭증과 dependency 위반을 막습니다.",
            tone: "violet",
          },
          {
            label: "DONE",
            title: "Artifact verification",
            body: "evidence가 완료 조건을 만족하는지 검사합니다.",
            tone: "emerald",
          },
        ]}
      />
      <OrchestrationRule>
        “완료했다”는 문장은 terminal condition이 아니며, verifier가 확인한
        artifact가 필요합니다.
      </OrchestrationRule>
    </OrchestrationFrame>
  );
}
