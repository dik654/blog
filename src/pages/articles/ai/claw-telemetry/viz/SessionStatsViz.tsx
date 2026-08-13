import {
  TelemetryFrame,
  TelemetryRule,
  TelemetrySteps,
} from "./TelemetryVizPrimitives";

export default function SessionStatsViz() {
  return (
    <TelemetryFrame
      label="TRACE TOPOLOGY"
      title="세션 하나를 turn과 실행 span으로 내려간다"
      description="사용자 세션은 여러 turn을 포함하고, 각 turn은 model request와 tool·hook·subagent span으로 이어집니다. parent 관계가 있어야 실패 경로를 복원할 수 있습니다."
      note="세션 ID를 모든 metric label에 넣으면 cardinality가 폭증합니다. 고유 ID는 trace와 log에 두고, metric에는 provider·model·operation·status처럼 제한된 차원만 사용합니다."
    >
      <TelemetrySteps
        items={[
          {
            label: "ROOT",
            title: "Session",
            body: "사용자 작업의 수명과 privacy·retention 경계를 나타냅니다.",
            tone: "blue",
          },
          {
            label: "CHILD",
            title: "Turn",
            body: "한 사용자 요청과 그에 대한 agent loop를 묶습니다.",
            tone: "violet",
          },
          {
            label: "SPAN",
            title: "Model · Tool · Hook",
            body: "시작·종료·status·duration과 원인 관계를 기록합니다.",
            tone: "amber",
          },
          {
            label: "EVENT",
            title: "Retry · Deny · Compact",
            body: "span 안에서 일어난 의미 있는 상태 변화를 시점과 함께 남깁니다.",
            tone: "emerald",
          },
        ]}
      />
      <TelemetryRule>
        model이 “완료했다”고 쓴 문장은 실행 증거가 아닙니다. tool exit status,
        생성물 identity, 정책 결정, 검증 결과처럼 시스템이 관찰한 사실을
        기록해야 합니다.
      </TelemetryRule>
    </TelemetryFrame>
  );
}
