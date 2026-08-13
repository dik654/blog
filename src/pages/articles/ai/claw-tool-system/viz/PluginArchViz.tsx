import { ToolFrame, ToolRule, ToolSteps } from "./ToolVizPrimitives";

export default function PluginArchViz() {
  return (
    <ToolFrame
      label="EXTENSION ADAPTER"
      title="외부 metadata와 executor를 host contract로 낮춘다"
      description="plugin과 MCP의 lifecycle은 각 owner에게 남기되 모델과 dispatch가 보는 spec·identity·effect·result 형식은 adapter가 통일합니다."
      note="외부 description과 error는 untrusted text입니다. source label을 보존하고 길이 제한·redaction을 적용하며 instruction과 같은 권한을 부여하지 않습니다."
    >
      <ToolSteps
        items={[
          {
            label: "SOURCE",
            title: "Plugin / MCP",
            body: "manifest 또는 protocol에서 untrusted metadata와 executor handle을 받습니다.",
            tone: "violet",
          },
          {
            label: "ADAPTER",
            title: "Host validate",
            body: "이름·schema·capability와 source instance를 host가 검증합니다.",
            tone: "blue",
          },
          {
            label: "REGISTRY",
            title: "Resolve & publish",
            body: "name·schema 충돌을 해결하고 새 generation을 publish합니다.",
            tone: "amber",
          },
          {
            label: "RUNTIME",
            title: "Dispatch",
            body: "공통 validation, permission, deadline과 result 계약을 적용합니다.",
            tone: "emerald",
          },
        ]}
      />
      <ToolRule>
        source가 재시작되면 이전 generation의 executor handle과 진행 중 call을
        새 instance에 묵시적으로 연결하지 않습니다.
      </ToolRule>
    </ToolFrame>
  );
}
