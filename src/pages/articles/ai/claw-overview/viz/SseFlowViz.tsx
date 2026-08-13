import {
  OverviewFrame,
  OverviewRule,
  OverviewSteps,
} from "./OverviewVizPrimitives";

export default function SseFlowViz() {
  return (
    <OverviewFrame
      label="SSE STATE MACHINE"
      title="delta는 누적하고 완성된 block만 session에 commit한다"
      description="text와 tool input은 content block 안에서 조각으로 도착하므로 parser가 시작·누적·종료 상태를 분리해야 합니다."
      note="Malformed JSON, 잘못된 block index와 early EOF는 별도 fixture로 재현합니다. 불완전한 tool call은 실행 가능한 값으로 승격하지 않습니다."
    >
      <OverviewSteps
        items={[
          {
            label: "01 · OPEN MESSAGE",
            title: "message_start",
            body: "assistant message와 stream 상태를 엽니다.",
            tone: "blue",
          },
          {
            label: "02 · OPEN BLOCK",
            title: "block_start",
            body: "text 또는 tool_use block의 type을 확정합니다.",
            tone: "violet",
          },
          {
            label: "03 · ACCUMULATE",
            title: "delta × N",
            body: "text나 partial JSON을 순서대로 누적합니다.",
            tone: "emerald",
          },
          {
            label: "04 · COMMIT",
            title: "block / message stop",
            body: "완성된 값만 commit하고 stream을 종료합니다.",
            tone: "amber",
          },
        ]}
      />
      <OverviewRule>
        조기 종료는 정상 종료의 축약이 아닙니다. 중간에 stream이 끊기면 host는
        불완전한 tool call을 실행하지 않고 명시적인 error state로 전환합니다.
      </OverviewRule>
    </OverviewFrame>
  );
}
