import {
  ProviderFrame,
  ProviderRule,
  ProviderSteps,
} from "./ProviderVizPrimitives";

export default function PromptCacheViz() {
  return (
    <ProviderFrame
      label="STABLE PREFIX DESIGN"
      title="재사용 가능한 prefix와 매번 바뀌는 suffix를 분리한다"
      description="provider가 정확히 같은 prefix 계산을 재사용할 수 있도록 tool·instruction·reference 순서를 안정화하고 실제 usage로 hit를 확인합니다."
      note="TTL·breakpoint·최소 길이·usage와 가격은 provider와 model 세대별 공식 문서를 기준으로 해석합니다."
    >
      <ProviderSteps
        items={[
          {
            label: "STABLE 01",
            title: "Tool schemas",
            body: "정렬과 serialization이 고정된 tool contract입니다.",
            tone: "blue",
          },
          {
            label: "STABLE 02",
            title: "Instructions",
            body: "timestamp가 섞이지 않은 system·reference context입니다.",
            tone: "violet",
          },
          {
            label: "BOUNDARY",
            title: "Cache breakpoint",
            body: "provider가 지원하는 방식으로 stable prefix 끝을 표시합니다.",
            tone: "amber",
          },
          {
            label: "DYNAMIC",
            title: "History + user",
            body: "이번 요청에서 달라지는 suffix와 새 output입니다.",
            tone: "emerald",
          },
        ]}
      />
      <ProviderRule>
        request hit rate가 아니라 cache read·write token, miss cause와 TTFT를
        함께 측정합니다.
      </ProviderRule>
    </ProviderFrame>
  );
}
