import { HookFrame, HookRule, HookSteps } from "./HookVizPrimitives";

export default function HookProtocolViz() {
  return (
    <HookFrame
      label="SUBPROCESS PROTOCOL"
      title="stdin은 request, stdout은 response, stderr는 진단으로 쓴다"
      description="hook을 임의 shell fragment가 아니라 versioned JSON 계약과 제한된 실행 환경을 가진 worker로 다룹니다."
      note="stdout·stderr·실행 시간·process tree에 모두 limit를 적용하고 secret은 environment와 log에서 최소화합니다."
    >
      <HookSteps
        items={[
          {
            label: "HOST",
            title: "Build request",
            body: "event ID와 필요한 최소 field만 JSON으로 만듭니다.",
            tone: "blue",
          },
          {
            label: "PROCESS",
            title: "Run isolated",
            body: "argv·canonical cwd·allowlisted env로 실행합니다.",
            tone: "violet",
          },
          {
            label: "PROTOCOL",
            title: "Parse response",
            body: "version·event·outcome·reason을 schema로 검증합니다.",
            tone: "amber",
          },
          {
            label: "HOST",
            title: "Apply policy",
            body: "hook criticality에 맞춰 fail-closed 또는 fail-open합니다.",
            tone: "emerald",
          },
        ]}
      />
      <HookRule>
        hook log는 stderr로 보내고 protocol stdout에 안내 문구를 섞지 않습니다.
      </HookRule>
    </HookFrame>
  );
}
