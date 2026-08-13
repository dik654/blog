import {
  OverviewFrame,
  OverviewRule,
  OverviewSteps,
} from "./OverviewVizPrimitives";

export default function ParityHarnessViz() {
  return (
    <OverviewFrame
      label="DETERMINISTIC HARNESS"
      title="외부 변수를 고정해 host loop의 state transition을 재현한다"
      description="fixture가 request와 SSE 응답을 정하고, 주 실행 runtime이 만든 관찰 결과를 명시된 invariant와 비교합니다."
      note="반복 가능성은 mock harness의 강점이지만 실제 인증, network, rate limit과 provider 전체 동작을 증명하지는 않습니다."
    >
      <OverviewSteps
        items={[
          {
            label: "01",
            title: "Request fixture",
            body: "prompt, header, tool 환경과 예상 invariant를 고정합니다.",
            tone: "blue",
          },
          {
            label: "02 · REPLAY",
            title: "Mock stream",
            body: "정상·오류 SSE frame을 매번 같은 순서로 재생합니다.",
            tone: "violet",
          },
          {
            label: "03 · HOST LOOP",
            title: "Rust runtime",
            body: "정본 Rust 경로의 parser, permission과 agent loop를 실행합니다.",
            tone: "emerald",
          },
          {
            label: "04 · VERIFY",
            title: "Assertion",
            body: "state, event order와 side effect invariant를 검사합니다.",
            tone: "amber",
          },
        ]}
      />
      <OverviewRule>
        fixture가 같으면 실패도 같은 위치에서 재현돼야 합니다. Golden output만
        갱신하지 않고 어떤 contract가 바뀌었는지 먼저 설명합니다.
      </OverviewRule>
    </OverviewFrame>
  );
}
