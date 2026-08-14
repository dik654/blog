import { ConfigFrame, ConfigRule, ConfigSteps } from "./ConfigVizPrimitives";

export default function BootstrapViz() {
  return (
    <ConfigFrame
      label="HARDENING TARGET"
      title="BootstrapPlan을 trust-aware 실행기로 확장한다"
      description="로컬 해석과 trust resolution을 끝낸 뒤 provider·plugin·MCP를 시작하고, 필수 capability가 검증돼야 Ready가 됩니다."
      note="Pinned source가 보장하는 것은 ordered·deduplicated plan입니다. 이 그림의 trust·readiness·cleanup은 검증해야 할 다음 계약입니다."
    >
      <ConfigSteps
        items={[
          {
            label: "01",
            title: "Discover",
            body: "config source와 canonical workspace를 찾습니다.",
            tone: "blue",
          },
          {
            label: "02",
            title: "Resolve trust",
            body: "provenance·policy·plugin capability를 결정합니다.",
            tone: "violet",
          },
          {
            label: "03",
            title: "Start external",
            body: "승인된 provider·plugin·MCP 연결만 시작합니다.",
            tone: "amber",
          },
          {
            label: "04",
            title: "Assemble Ready",
            body: "필수 capability와 cleanup handle을 함께 공개합니다.",
            tone: "emerald",
          },
        ]}
      />
      <ConfigRule>
        initialization generation이 바뀌면 이전 실행의 늦은 callback은
        폐기합니다.
      </ConfigRule>
    </ConfigFrame>
  );
}
