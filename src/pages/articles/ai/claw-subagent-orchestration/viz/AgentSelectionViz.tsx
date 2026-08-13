import {
  OrchestrationFrame,
  OrchestrationRule,
  OrchestrationSteps,
} from "./OrchestrationVizPrimitives";

export default function AgentSelectionViz() {
  return (
    <OrchestrationFrame
      label="ROUTING"
      title="task contract로 후보를 좁힌 뒤 실행 환경을 고른다"
      description="역할 이름보다 capability, access, artifact와 비용 조건을 먼저 맞춥니다."
      note="간단한 작업은 delegation하지 않고 main agent가 직접 처리하는 선택도 포함합니다."
    >
      <OrchestrationSteps
        items={[
          {
            label: "01",
            title: "Work unit",
            body: "독립 deliverable과 완료 조건을 정합니다.",
            tone: "blue",
          },
          {
            label: "02",
            title: "Hard filter",
            body: "tool·path·isolation 조건이 안 맞는 후보를 뺍니다.",
            tone: "rose",
          },
          {
            label: "03",
            title: "Rank",
            body: "품질·latency·비용으로 남은 후보를 비교합니다.",
            tone: "violet",
          },
          {
            label: "04",
            title: "Dispatch",
            body: "고정된 contract와 capability로 session을 만듭니다.",
            tone: "emerald",
          },
        ]}
      />
      <OrchestrationRule>
        후보 수는 tuning 값이며, 모든 agent description을 prompt에 넣는 것이
        목표가 아닙니다.
      </OrchestrationRule>
    </OrchestrationFrame>
  );
}
