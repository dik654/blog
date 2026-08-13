import { PolicyFrame, PolicyRule, PolicySteps } from "./PolicyVizPrimitives";

export default function GreenContractViz() {
  return (
    <PolicyFrame
      label="QUALITY GATE"
      title="green 요약보다 revision에 묶인 evidence가 중요하다"
      description="필수 check가 현재 revision과 policy version에서 유효한지 확인하고 waiver는 pass와 분리해 기록합니다."
      note="GreenContract는 내부 코드 이름이며, 일반적으로는 quality gate 또는 merge gate에 해당합니다."
    >
      <PolicySteps
        items={[
          {
            label: "SELECT",
            title: "Requirements",
            body: "변경 영향과 release policy에서 required check를 정합니다.",
            tone: "blue",
          },
          {
            label: "BIND",
            title: "Revision",
            body: "결과를 SHA·runner·check version에 묶습니다.",
            tone: "violet",
          },
          {
            label: "ASSESS",
            title: "Evidence states",
            body: "Pass·Fail·Pending·Stale·Waived를 구분합니다.",
            tone: "amber",
          },
          {
            label: "RECHECK",
            title: "Merge precondition",
            body: "head와 contract generation을 직전에 다시 확인합니다.",
            tone: "emerald",
          },
        ]}
      />
      <PolicyRule>
        flaky retry와 waiver는 원래 failure를 지우지 않고 별도 evidence로
        남깁니다.
      </PolicyRule>
    </PolicyFrame>
  );
}
