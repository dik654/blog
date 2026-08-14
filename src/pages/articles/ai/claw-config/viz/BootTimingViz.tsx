import { ConfigFrame, ConfigRule, ConfigSteps } from "./ConfigVizPrimitives";

export default function BootTimingViz() {
  return (
    <ConfigFrame
      label="HARDENING OBSERVABILITY"
      title="필수 경로와 optional 초기화를 따로 관찰한다"
      description="고정된 정상 시간보다 phase별 실제 elapsed와 dependency를 기록해야 병목과 degraded state를 구분할 수 있습니다."
      note="실제 baseline은 배포 환경에서 수집한 percentile로 정하고, 문서의 예시 숫자를 SLA처럼 사용하지 않습니다."
    >
      <ConfigSteps
        columns={3}
        items={[
          {
            label: "REQUIRED",
            title: "Critical path",
            body: "config → trust → provider → permission engine",
            tone: "blue",
          },
          {
            label: "PARALLEL",
            title: "Optional startup",
            body: "telemetry와 요청에 필요하지 않은 MCP는 병렬로 준비합니다.",
            tone: "violet",
          },
          {
            label: "FAILURE",
            title: "Cleanup",
            body: "만들어진 process·socket·lease를 역순으로 회수합니다.",
            tone: "rose",
          },
        ]}
      />
      <ConfigRule>
        Ready event에는 available·degraded·unavailable capability를 함께
        싣습니다.
      </ConfigRule>
    </ConfigFrame>
  );
}
