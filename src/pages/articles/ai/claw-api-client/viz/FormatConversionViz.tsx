import {
  ProviderFrame,
  ProviderRule,
  ProviderSteps,
} from "./ProviderVizPrimitives";

export default function FormatConversionViz() {
  return (
    <ProviderFrame
      label="SEMANTIC ADAPTER"
      title="provider끼리 직접 변환하지 않고 공통 의미 모델을 거친다"
      description="role·content item·tool correlation·terminal state를 보존하는 내부 표현에서 각 API family의 request와 event로 변환합니다."
      note="지원하지 않는 의미를 조용히 삭제하지 않고 capability error 또는 명시적 fallback으로 처리합니다."
    >
      <ProviderSteps
        items={[
          {
            label: "RUNTIME",
            title: "Semantic request",
            body: "instruction·content·tools·budget의 의미를 보존합니다.",
            tone: "blue",
          },
          {
            label: "PROFILE",
            title: "Capability check",
            body: "model·API family가 각 feature를 지원하는지 확인합니다.",
            tone: "violet",
          },
          {
            label: "ADAPTER",
            title: "Provider payload",
            body: "role·block·tool schema를 정확한 wire format으로 만듭니다.",
            tone: "amber",
          },
          {
            label: "RUNTIME",
            title: "Semantic events",
            body: "stream·usage·error를 공통 event로 되돌립니다.",
            tone: "emerald",
          },
        ]}
      />
      <ProviderRule>
        Anthropic ↔ OpenAI 같은 pairwise converter 대신 provider 수와 무관한
        adapter 경계를 유지합니다.
      </ProviderRule>
    </ProviderFrame>
  );
}
