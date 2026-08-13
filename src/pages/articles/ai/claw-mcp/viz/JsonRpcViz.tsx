import { McpFrame, McpRule, McpSteps } from "./McpVizPrimitives";

export default function JsonRpcViz() {
  return (
    <McpFrame
      label="STDIO TRANSPORT"
      title="stdout의 JSON-RPC와 stderr의 log를 섞지 않는다"
      description="writer는 request를 보내고 reader는 id로 response를 caller에 전달하며, notification과 diagnostic log는 별도 경로로 처리합니다."
      note="MCP stdio message는 newline-delimited UTF-8 JSON이며 embedded newline을 포함하지 않습니다."
    >
      <McpSteps
        items={[
          {
            label: "STDIN",
            title: "request writer",
            body: "pending map 등록 뒤 JSON-RPC 한 줄을 기록합니다.",
            tone: "blue",
          },
          {
            label: "STDOUT",
            title: "response reader",
            body: "각 줄을 parse하고 id로 기다리는 caller를 찾습니다.",
            tone: "emerald",
          },
          {
            label: "NO ID",
            title: "notification",
            body: "response와 분리해 progress·log event로 dispatch합니다.",
            tone: "violet",
          },
          {
            label: "STDERR",
            title: "diagnostic drain",
            body: "protocol을 오염시키지 않고 buffer가 차지 않게 소비합니다.",
            tone: "amber",
          },
        ]}
      />
      <McpRule>
        <strong>종료 불변식:</strong> EOF·timeout·child exit 때 모든 pending
        caller를 오류로 완료하고 background task를 함께 정리합니다.
      </McpRule>
    </McpFrame>
  );
}
