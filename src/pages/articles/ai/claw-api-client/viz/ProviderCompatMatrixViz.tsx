import {
  ProviderFrame,
  ProviderRule,
  ProviderSteps,
} from "./ProviderVizPrimitives";

export default function ProviderCompatMatrixViz() {
  return (
    <ProviderFrame
      label="WEATHER-17 CONTRACT"
      title="두 provider의 wire event를 같은 tool-call-17로 내릴 수 있는가"
      description="서울 날씨 요청 하나로 partial JSON, terminal event, EOF와 usage를 차례로 확인합니다."
      note="HTTP 200은 transport 성공일 뿐입니다. 완성된 JSON·terminal state·usage 의미가 fixture와 맞아야 provider compatibility를 기록합니다."
    >
      <ProviderSteps
        compactMobile
        items={[
          {
            label: "01 · REQUEST",
            title: "weather-17",
            body: "공통 get_weather schema를 provider payload로 바꿉니다.",
            tone: "blue",
          },
          {
            label: "02 · DELTAS",
            title: "부분 JSON 조립",
            body: "두 JSON 조각을 call ID별 buffer에 모읍니다.",
            tone: "violet",
          },
          {
            label: "03 · TERMINAL",
            title: "Stop 또는 EOF",
            body: "Stop은 parse로, terminal 없는 EOF는 partial failure로 갑니다.",
            tone: "amber",
          },
          {
            label: "04 · COMMIT",
            title: "공통 event 확정",
            body: "JSON·schema·terminal·usage가 맞을 때만 commit합니다.",
            tone: "emerald",
          },
        ]}
      />
      <ProviderRule>
        A는 terminal까지 오면 commit할 수 있습니다. B가 200 뒤 EOF로 끝나면
        text가 일부 있어도 같은 성공 event로 바꾸지 않습니다.
      </ProviderRule>
    </ProviderFrame>
  );
}
