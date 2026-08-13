import { HookFrame, HookRule, HookSteps } from "./HookVizPrimitives";

export default function PermissionOverrideViz() {
  return (
    <HookFrame
      label="MONOTONIC RESTRICTION"
      title="뒤 단계는 앞에서 제한한 permission을 다시 넓히지 못한다"
      description="base policy와 여러 hook outcome을 Deny·Prompt·Allow 순으로 결합해 config 순서와 무관한 결과를 만듭니다."
      note="권한을 넓히는 예외는 일반 hook output이 아니라 owner·scope·expiry가 있는 신뢰된 policy에서 관리합니다."
    >
      <HookSteps
        columns={3}
        items={[
          {
            label: "STRICTEST",
            title: "Deny",
            body: "하나라도 deny하면 executor를 호출하지 않습니다.",
            tone: "rose",
          },
          {
            label: "MIDDLE",
            title: "Prompt",
            body: "deny가 없고 확인이 필요할 때 한 번만 묻습니다.",
            tone: "amber",
          },
          {
            label: "LEAST",
            title: "Allow",
            body: "base와 모든 pre hook이 허용한 경우에만 남습니다.",
            tone: "emerald",
          },
        ]}
      />
      <HookRule>
        hook 순서가 바뀌어도 같은 input과 config version에서는 같은 decision이
        나와야 합니다.
      </HookRule>
    </HookFrame>
  );
}
