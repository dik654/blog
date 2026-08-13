import { ConfigFrame, ConfigRule, ConfigSteps } from "./ConfigVizPrimitives";

export default function RemoteViz() {
  return (
    <ConfigFrame
      label="REMOTE SESSION"
      title="UI와 실행 환경 사이에 authenticated channel을 둔다"
      description="local은 입력과 approval을 맡고, remote는 workspace·tool·provider를 다루므로 session identity가 모든 message를 묶어야 합니다."
      note="remote runtime이 local과 같은 UI를 제공해도 credential, audit와 failure boundary는 같지 않습니다."
    >
      <ConfigSteps
        items={[
          {
            label: "LOCAL",
            title: "CLI",
            body: "사용자 입력·렌더링·permission decision을 담당합니다.",
            tone: "blue",
          },
          {
            label: "CHANNEL",
            title: "WSS + session",
            body: "server identity·short-lived auth·sequence를 검증합니다.",
            tone: "violet",
          },
          {
            label: "REMOTE",
            title: "Runtime",
            body: "workspace state와 tool execution을 소유합니다.",
            tone: "amber",
          },
          {
            label: "UPSTREAM",
            title: "Provider & tools",
            body: "scoped credential로 외부 service를 호출합니다.",
            tone: "emerald",
          },
        ]}
      />
      <ConfigRule>
        permission 응답은 session·request·attempt와 canonical action에만
        적용됩니다.
      </ConfigRule>
    </ConfigFrame>
  );
}
