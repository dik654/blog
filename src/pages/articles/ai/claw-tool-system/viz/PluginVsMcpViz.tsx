import { ToolFrame, ToolRule, ToolSteps } from "./ToolVizPrimitives";

export default function PluginVsMcpViz() {
  return (
    <ToolFrame
      label="SAME SURFACE, DIFFERENT LIFECYCLE"
      title="공통 tool surface가 source별 장애 책임까지 지우지는 않는다"
      description="adapter는 모델과 dispatch가 보는 interface를 통일하지만 plugin과 MCP의 연결·재시작·credential owner는 각각 남겨 둡니다."
      note="retry는 generic dispatch가 추측하지 않습니다. source lifecycle 상태, call generation과 side effect의 idempotency를 확인한 뒤 owner가 결정합니다."
    >
      <ToolSteps
        columns={3}
        items={[
          {
            label: "PLUGIN",
            title: "Manifest lifecycle",
            body: "발견·활성화·subprocess health와 local credential을 plugin owner가 관리합니다.",
            tone: "violet",
          },
          {
            label: "MCP",
            title: "Protocol lifecycle",
            body: "initialize·transport·server capability와 remote credential을 MCP owner가 관리합니다.",
            tone: "amber",
          },
          {
            label: "COMMON",
            title: "Tool contract",
            body: "identity·permission·deadline·result envelope를 공유합니다.",
            tone: "emerald",
          },
        ]}
      />
      <ToolRule>
        모델에는 stable public error를 돌려주되 telemetry에는 call ID와 함께
        source·instance·generation·redacted transport cause를 보존합니다.
      </ToolRule>
    </ToolFrame>
  );
}
