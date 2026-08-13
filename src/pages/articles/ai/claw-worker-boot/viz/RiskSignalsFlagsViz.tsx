import { WorkerFrame, WorkerRule, WorkerSteps } from "./WorkerVizPrimitives";

export default function RiskSignalsFlagsViz() {
  return (
    <WorkerFrame
      label="RISK-SPECIFIC RESTRICTION"
      title="signal마다 다른 capability를 제한한다"
      description="모호한 trust score 대신 실제 위험이 닿는 실행 경계를 좁힙니다."
      note="패턴이 감지되지 않았다는 사실은 안전 증명이 아니며 기본 sandbox와 permission은 유지됩니다."
    >
      <WorkerSteps
        items={[
          {
            label: "HOOK",
            title: "Executable config",
            body: "자동 실행을 끄고 원문과 target을 검토합니다.",
            tone: "rose",
          },
          {
            label: "MCP",
            title: "Remote server",
            body: "endpoint와 tool scope를 승인 전까지 노출하지 않습니다.",
            tone: "violet",
          },
          {
            label: "SECRET",
            title: "Credential access",
            body: "short-lived handle과 최소 audience만 발급합니다.",
            tone: "amber",
          },
          {
            label: "FILES",
            title: "Broad write",
            body: "workspace view를 read-only 또는 좁은 path로 제한합니다.",
            tone: "blue",
          },
        ]}
      />
      <WorkerRule>
        제한 이유를 사용자와 audit log에 같은 vocabulary로 남깁니다.
      </WorkerRule>
    </WorkerFrame>
  );
}
