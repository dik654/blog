import { ToolFrame, ToolRule, ToolSteps } from "./ToolVizPrimitives";

export default function PermissionDecisionViz() {
  return (
    <ToolFrame
      label="POLICY ADAPTER"
      title="host가 계산한 effect에 permission decision을 묶는다"
      description="모델이나 tool metadata의 안전 선언을 믿지 않고 canonical path·command·resource를 host action으로 만든 뒤 정책 엔진의 결과를 강제합니다."
      note="정책을 해석할 수 없거나 context가 빠졌다면 민감한 action은 fail-closed합니다. Allow는 executor 성공을 뜻하지 않으며 permission failure와 execution failure를 구분합니다."
    >
      <ToolSteps
        items={[
          {
            label: "DESCRIBE",
            title: "Canonical action",
            body: "edit_file·canonical path·overwrite 범위와 action digest를 고정합니다.",
            tone: "blue",
          },
          {
            label: "DECIDE",
            title: "Allow",
            body: "동일한 action digest와 한 번 쓰는 approval을 executor에 전달합니다.",
            tone: "emerald",
          },
          {
            label: "DECIDE",
            title: "Prompt",
            body: "사용자에게 변경 파일·범위·요청 이유를 구체적으로 보여줍니다.",
            tone: "amber",
          },
          {
            label: "DECIDE",
            title: "Deny",
            body: "executor를 호출하지 않고 stable reason code를 반환합니다.",
            tone: "rose",
          },
        ]}
      />
      <ToolRule>
        모델이 path나 arguments를 바꾸면 action digest도 달라지므로 이전 승인을
        재사용하지 않습니다. 승인 여부는 모델 출력이 아니라 host state입니다.
      </ToolRule>
    </ToolFrame>
  );
}
