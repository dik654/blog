import {
  TelemetryFrame,
  TelemetryRule,
  TelemetrySteps,
} from "./TelemetryVizPrimitives";

export default function TelemetryArchViz() {
  return (
    <TelemetryFrame
      label="SESSION-7 · TURN-12"
      title="로그인 수정과 test timeout을 한 trace로 다시 구성한다"
      description="model-1→tool-edit-1→test-1을 같은 identity로 잇고, 민감 정보와 export 실패를 별도로 처리합니다."
      note="test-1 span이 없다는 사실만으로 테스트가 실행되지 않았다고 단정할 수 없습니다. Queue drop·export failure를 함께 확인해야 합니다."
    >
      <TelemetrySteps
        items={[
          {
            label: "01 · CAPTURE",
            title: "세 호출을 연결",
            body: "session-7·turn-12 아래 model-1, tool-edit-1, test-1을 기록합니다.",
            tone: "blue",
          },
          {
            label: "02 · PROCESS",
            title: "내용 제거·집계",
            body: "인자 속 secret을 지우고 edit latency와 test timeout을 분류합니다.",
            tone: "violet",
          },
          {
            label: "03 · BUFFER",
            title: "bounded queue",
            body: "감사 event를 우선 보존하고 상한 초과 drop 수를 따로 셉니다.",
            tone: "amber",
          },
          {
            label: "04 · EXPORT",
            title: "관측 backend",
            body: "OTLP·JSONL로 보내며 test-1 누락 여부를 drop metric과 대조합니다.",
            tone: "emerald",
          },
        ]}
        compactMobile
      />
      <TelemetryRule>
        p95 metric은 분포를 보여줄 뿐 test-1의 인과관계를 설명하지 않습니다.
        조사할 때 trace·metric·log·event를 같은 identity로 다시 연결합니다.
      </TelemetryRule>
    </TelemetryFrame>
  );
}
