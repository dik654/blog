import {
  TelemetryFrame,
  TelemetryRule,
  TelemetrySteps,
} from "./TelemetryVizPrimitives";

export default function ModelPricingViz() {
  return (
    <TelemetryFrame
      label="VERSIONED PRICING"
      title="모델 이름만으로 단가를 하드코딩하지 않는다"
      description="같은 모델 계열도 service tier, cache 유형, batch 여부와 적용 시점에 따라 과금 방식이 달라질 수 있으므로 가격표를 데이터로 관리합니다."
      note="화면에는 통화와 계산 기준 시점을 함께 표시합니다. 가격을 찾지 못한 모델은 0원으로 처리하지 말고 unknown estimate로 남깁니다."
    >
      <TelemetrySteps
        columns={3}
        items={[
          {
            label: "IDENTITY",
            title: "provider · SKU · tier",
            body: "별칭이 아니라 청구 가능한 상품 identity에 연결합니다.",
            tone: "blue",
          },
          {
            label: "RATE",
            title: "단위별 decimal rate",
            body: "input·output·cache read·cache write를 통화와 단위별로 분리합니다.",
            tone: "amber",
          },
          {
            label: "VERSION",
            title: "effective_at · source",
            body: "언제부터 적용됐고 어느 공식 가격표에서 왔는지 기록합니다.",
            tone: "emerald",
          },
        ]}
      />
      <TelemetryRule>
        float 누적 대신 decimal 또는 최소 화폐 단위의 정수를 사용합니다. 표시
        단계에서만 반올림해야 긴 세션과 여러 모델의 합계가 흔들리지 않습니다.
      </TelemetryRule>
    </TelemetryFrame>
  );
}
