import {
  ProviderFrame,
  ProviderRule,
  ProviderSteps,
} from "./ProviderVizPrimitives";

export default function ProviderCompatMatrixViz() {
  return (
    <ProviderFrame
      label="CONTRACT TESTS"
      title="기능 매트릭스는 문서의 체크표가 아니라 실행되는 test 결과다"
      description="provider·model·API version별 request, stream, error와 usage fixture를 검증해 observed capability profile을 만듭니다."
      note="지원 여부는 시간이 지나며 바뀌므로 hard-coded 회사별 표보다 확인 날짜와 test evidence를 노출합니다."
    >
      <ProviderSteps
        items={[
          {
            label: "REQUEST",
            title: "Schema fidelity",
            body: "role·content·tool·structured output 변환을 검사합니다.",
            tone: "blue",
          },
          {
            label: "STREAM",
            title: "Event sequence",
            body: "text·tool delta·unknown·terminal event를 검사합니다.",
            tone: "violet",
          },
          {
            label: "FAILURE",
            title: "Error behavior",
            body: "rate limit·timeout·partial stream의 mapping을 검사합니다.",
            tone: "amber",
          },
          {
            label: "METERING",
            title: "Usage semantics",
            body: "input·output·reasoning·cache field 해석을 검사합니다.",
            tone: "emerald",
          },
        ]}
      />
      <ProviderRule>
        endpoint가 200을 반환하는 것과 feature semantics가 호환되는 것은
        다릅니다.
      </ProviderRule>
    </ProviderFrame>
  );
}
