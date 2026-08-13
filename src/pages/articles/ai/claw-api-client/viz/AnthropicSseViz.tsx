import {
  ProviderFrame,
  ProviderRule,
  ProviderSteps,
} from "./ProviderVizPrimitives";

export default function AnthropicSseViz() {
  return (
    <ProviderFrame
      label="ANTHROPIC BLOCK STREAM"
      title="SSE framing 뒤에 message와 content block lifecycle을 복원한다"
      description="transport chunk를 event로 만든 뒤 block index별 text·thinking·tool input delta를 누적하고 정상 stop에서 완료합니다."
      note="ping·error·unknown event를 처리하고 block stop이 없는 tool input은 executor에 넘기지 않습니다."
    >
      <ProviderSteps
        items={[
          {
            label: "01",
            title: "Frame SSE",
            body: "HTTP byte stream에서 완전한 SSE event를 만듭니다.",
            tone: "blue",
          },
          {
            label: "02",
            title: "Parse event",
            body: "message·block·ping·error type을 검증합니다.",
            tone: "violet",
          },
          {
            label: "03",
            title: "Assemble blocks",
            body: "index와 tool-use ID별 delta를 분리해 누적합니다.",
            tone: "amber",
          },
          {
            label: "04",
            title: "Emit terminal",
            body: "stop reason·usage·완성 block을 내부 event로 확정합니다.",
            tone: "emerald",
          },
        ]}
      />
      <ProviderRule>
        일부 text가 도착했어도 정상 terminal event가 없으면 partial failure로
        반환합니다.
      </ProviderRule>
    </ProviderFrame>
  );
}
