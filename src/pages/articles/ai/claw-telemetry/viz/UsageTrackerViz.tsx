import {
  TelemetryFrame,
  TelemetryRule,
  TelemetrySteps,
} from "./TelemetryVizPrimitives";

export default function UsageTrackerViz() {
  return (
    <TelemetryFrame
      label="USAGE LEDGER"
      title="provider가 반환한 사용량을 원장에 한 번만 기록한다"
      description="응답 identity와 가격표 버전을 함께 저장하면 retry·stream 재연결의 중복 집계를 막고, 나중에 단가가 바뀌어도 당시 추정값을 재현할 수 있습니다."
      note="요청 전 tokenizer로 센 값은 예산 예약용 estimate이고, 응답 usage는 관측값입니다. 두 값을 같은 필드에 덮어쓰지 않아야 오차와 누락을 찾을 수 있습니다."
    >
      <TelemetrySteps
        items={[
          {
            label: "01 · OBSERVE",
            title: "응답 usage",
            body: "provider·model·response ID와 input·output·cache usage를 보존합니다.",
            tone: "blue",
          },
          {
            label: "02 · DEDUPE",
            title: "중복 방지",
            body: "retry와 재연결이 같은 응답을 다시 전달해도 한 번만 반영합니다.",
            tone: "violet",
          },
          {
            label: "03 · PRICE",
            title: "버전된 단가 적용",
            body: "effective_at·currency·unit이 있는 catalog로 비용을 계산합니다.",
            tone: "amber",
          },
          {
            label: "04 · RECONCILE",
            title: "청구와 대조",
            body: "추정 비용을 provider invoice와 비교해 누락·할인·반올림 차이를 표시합니다.",
            tone: "emerald",
          },
        ]}
      />
      <TelemetryRule>
        budget alert는 화면 경고와 실행 차단을 분리해야 합니다. 경고는
        추정치로도 가능하지만 hard limit은 동시 요청의 예약 비용과 실패 시 환급
        규칙까지 있어야 일관됩니다.
      </TelemetryRule>
    </TelemetryFrame>
  );
}
