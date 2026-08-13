import { WorkerFrame, WorkerRule, WorkerSteps } from "./WorkerVizPrimitives";

export default function TrustDecisionViz() {
  return (
    <WorkerFrame
      label="TRUST TO CAPABILITY"
      title="신뢰 판정을 구체적인 실행 권한으로 바꾼다"
      description="경로 하나를 통째로 신뢰하지 않고 source identity와 risk signal별 restriction을 적용합니다."
      note="read 승인과 executable·network·secret 승인은 서로 다른 범위와 만료 조건을 가집니다."
    >
      <WorkerSteps
        items={[
          {
            label: "01",
            title: "Identify",
            body: "canonical path, remote, commit과 owner를 확인합니다.",
            tone: "blue",
          },
          {
            label: "02",
            title: "Inspect",
            body: "hook, MCP, credential과 broad access signal을 찾습니다.",
            tone: "violet",
          },
          {
            label: "03",
            title: "Decide",
            body: "사용자 결정과 policy로 capability를 계산합니다.",
            tone: "amber",
          },
          {
            label: "04",
            title: "Enforce",
            body: "runtime·sandbox·registry에서 실제 범위를 제한합니다.",
            tone: "emerald",
          },
        ]}
      />
      <WorkerRule>
        오래된 path 승인만으로 새 checkout이나 변경된 hook을 자동 허용하지
        않습니다.
      </WorkerRule>
    </WorkerFrame>
  );
}
