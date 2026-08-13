import { McpFrame, McpRule, McpSteps } from "./McpVizPrimitives";

export default function ToolBridgeViz() {
  return (
    <McpFrame
      label="TOOL BRIDGE"
      title="발견된 capability를 바로 권한으로 취급하지 않는다"
      description="remote tool의 이름과 schema를 검증하고 내부 permission을 붙인 뒤, 실행 결과의 업무 오류와 protocol 오류를 구분합니다."
      note="MCP는 tool을 model-controlled primitive로 정의하지만 application의 승인 UI와 권한 정책은 harness가 책임집니다."
    >
      <McpSteps
        items={[
          {
            label: "DISCOVER",
            title: "tools/list",
            body: "server가 광고한 name·description·inputSchema를 가져옵니다.",
            tone: "blue",
          },
          {
            label: "NORMALIZE",
            title: "namespace·schema",
            body: "안정적인 qualified name을 만들고 schema subset을 검증합니다.",
            tone: "violet",
          },
          {
            label: "AUTHORIZE",
            title: "내부 permission",
            body: "server·tool·argument·workspace 범위로 실제 호출을 판정합니다.",
            tone: "amber",
          },
          {
            label: "EXECUTE",
            title: "tools/call",
            body: "content·structuredContent·isError를 내부 결과로 보존합니다.",
            tone: "emerald",
          },
        ]}
      />
      <McpRule>
        <strong>이름 소유권:</strong> model-facing name은 reconnect와 catalog
        순서가 바뀌어도 동일해야 하며 충돌을 조용히 덮어쓰지 않습니다.
      </McpRule>
    </McpFrame>
  );
}
