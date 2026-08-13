import { ToolFrame, ToolRule, ToolSteps } from "./ToolVizPrimitives";

export default function DispatchViz() {
  return (
    <ToolFrame
      label="MODEL PROPOSAL → HOST EFFECT"
      title="모델의 tool call은 실행 명령이 아니라 검증할 제안이다"
      description="host는 이름·schema·registry generation을 고정하고 domain·effect·permission을 검증한 뒤에만 executor를 호출합니다."
      note="model, hook, cron과 recovery에서 온 call도 같은 entry를 사용합니다. call source가 내부라는 이유로 schema·permission·deadline 검사를 생략하지 않습니다."
    >
      <ToolSteps
        items={[
          {
            label: "01 · PROPOSE",
            title: "read / search",
            body: "모델이 로그인 실패 위치를 찾을 tool name과 JSON arguments를 제안합니다.",
            tone: "blue",
          },
          {
            label: "02 · BIND",
            title: "Registry identity",
            body: "host가 name·schema digest·generation과 call budget을 고정합니다.",
            tone: "violet",
          },
          {
            label: "03 · HOST GATE",
            title: "Validate & authorize",
            body: "schema·workspace boundary를 검사하고 구체적 effect의 permission을 강제합니다.",
            tone: "amber",
          },
          {
            label: "04 · OBSERVE",
            title: "Execute & result",
            body: "executor가 edit와 deterministic test를 수행하고 stable result envelope를 반환합니다.",
            tone: "emerald",
          },
        ]}
      />
      <ToolRule>
        로그인 실패 수정은 read/search → edit → deterministic test 순서를
        지킵니다. 독립적인 read끼리는 병렬화할 수 있지만 edit 결과에 의존하는
        test를 함께 실행하면 검증 전 상태를 읽는 race가 생깁니다.
      </ToolRule>
    </ToolFrame>
  );
}
