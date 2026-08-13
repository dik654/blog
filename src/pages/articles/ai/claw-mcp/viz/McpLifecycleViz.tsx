import { McpFrame, McpRule, McpSteps } from "./McpVizPrimitives";

export default function McpLifecycleViz() {
  return (
    <McpFrame
      label="LEGACY SNAPSHOT → CURRENT SPEC"
      title="내부 operation state와 MCP wire lifecycle을 분리한다"
      description="Claw snapshot은 2025 handshake를 11개 내부 상태로 관리하지만, 2026-07-28 revision은 stateless core로 바뀌었습니다."
      note="11은 표준 상태 수가 아닙니다. process·timeout·UI·cleanup을 관측하기 위한 해당 client의 구현 선택입니다."
    >
      <McpSteps
        items={[
          {
            label: "PROCESS",
            title: "spawn·streams",
            body: "child process와 stdin·stdout·stderr를 준비합니다.",
            tone: "blue",
          },
          {
            label: "LEGACY",
            title: "initialize handshake",
            body: "version과 capability를 교환한 뒤 initialized를 보냅니다.",
            tone: "violet",
          },
          {
            label: "OPERATION",
            title: "ready·degraded",
            body: "광고된 capability 범위에서만 operation을 허용합니다.",
            tone: "emerald",
          },
          {
            label: "CURRENT",
            title: "stateless request",
            body: "최신 revision은 handshake 대신 request metadata와 선택적 discovery를 사용합니다.",
            tone: "amber",
          },
        ]}
      />
      <McpRule>
        <strong>Migration 기준:</strong> process lifecycle은 유지하되 legacy
        handshake state를 protocol revision별 adapter로 격리합니다.
      </McpRule>
    </McpFrame>
  );
}
