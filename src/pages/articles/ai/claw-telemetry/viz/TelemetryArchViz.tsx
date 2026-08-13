import {
  TelemetryFrame,
  TelemetryRule,
  TelemetrySteps,
} from "./TelemetryVizPrimitives";

export default function TelemetryArchViz() {
  return (
    <TelemetryFrame
      label="EVIDENCE PIPELINE"
      title="실행 이벤트를 먼저 정규화하고 여러 signal로 나눈다"
      description="모델 요청과 tool 실행에서 나온 이벤트에 공통 identity를 붙인 뒤 trace·metric·log로 투영하고, 민감 정보는 exporter보다 앞에서 제거합니다."
      note="Trace·metric·log는 같은 사건을 다른 방식으로 보는 signal입니다. 서로 별도 ID를 만들기보다 trace_id와 span_id로 다시 연결할 수 있어야 합니다."
    >
      <TelemetrySteps
        items={[
          {
            label: "01 · CAPTURE",
            title: "구조화된 이벤트",
            body: "session·turn·model request·tool call identity와 결과를 기록합니다.",
            tone: "blue",
          },
          {
            label: "02 · PROCESS",
            title: "필터와 집계",
            body: "redaction, sampling, cardinality 제한, histogram 집계를 적용합니다.",
            tone: "violet",
          },
          {
            label: "03 · BUFFER",
            title: "bounded queue",
            body: "우선순위와 상한을 두고 느린 exporter의 backpressure를 격리합니다.",
            tone: "amber",
          },
          {
            label: "04 · EXPORT",
            title: "관측 backend",
            body: "OTLP·JSONL 등으로 내보내되 drop과 retry도 별도 metric으로 남깁니다.",
            tone: "emerald",
          },
        ]}
      />
      <TelemetryRule>
        prompt와 tool arguments는 디버깅에 유용하지만 PII·secret·소스코드를 담을
        수 있습니다. 기본값은 내용 미수집이며, opt-in capture도 길이 제한과
        redaction을 거쳐야 합니다.
      </TelemetryRule>
    </TelemetryFrame>
  );
}
