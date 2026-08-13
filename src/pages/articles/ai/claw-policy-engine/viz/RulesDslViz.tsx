import { PolicyFrame, PolicyRule, PolicySteps } from "./PolicyVizPrimitives";

export default function RulesDslViz() {
  return (
    <PolicyFrame
      label="DECLARATIVE RULE"
      title="condition은 snapshot을 읽고 action proposal만 만든다"
      description="평가와 실행을 분리하면 같은 evidence에서 같은 decision을 재현하고 action 직전에 최신 state를 다시 확인할 수 있습니다."
      note="DSL은 범용 표준이 아니라 이 저장소의 내부 표현이며, custom code는 별도 sandbox boundary로 취급합니다."
    >
      <PolicySteps
        items={[
          {
            label: "01",
            title: "Snapshot",
            body: "version과 provenance가 있는 immutable evidence입니다.",
            tone: "blue",
          },
          {
            label: "02",
            title: "Evaluate",
            body: "True·False·Unknown으로 condition을 계산합니다.",
            tone: "violet",
          },
          {
            label: "03",
            title: "Arbitrate",
            body: "여러 proposal의 priority와 충돌을 해결합니다.",
            tone: "amber",
          },
          {
            label: "04",
            title: "Execute",
            body: "expected version과 권한을 재검증한 뒤 적용합니다.",
            tone: "emerald",
          },
        ]}
      />
      <PolicyRule>
        action은 rule·resource·state version으로 만든 idempotency key를
        사용합니다.
      </PolicyRule>
    </PolicyFrame>
  );
}
