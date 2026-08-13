import { BashFrame, BashRule, BashSteps } from "./BashVizPrimitives";

export default function IntentCategoriesViz() {
  return (
    <BashFrame
      label="POLICY SIGNAL"
      title="intent는 side effect의 종류를 설명한다"
      description="범주는 승인 문구, permission rule과 audit level을 고르는 데 사용합니다."
      note="Unknown은 안전을 뜻하지 않습니다. confidence가 낮을수록 더 강한 승인과 격리를 적용합니다."
    >
      <BashSteps
        items={[
          {
            label: "DATA",
            title: "Read · write",
            body: "로컬 데이터를 읽거나 변경하는 작업입니다.",
            tone: "blue",
          },
          {
            label: "IMPACT",
            title: "Destructive · system",
            body: "복구가 어렵거나 host 상태를 바꿀 수 있습니다.",
            tone: "rose",
          },
          {
            label: "BOUNDARY",
            title: "Network · package",
            body: "외부 통신과 code 공급망을 함께 엽니다.",
            tone: "violet",
          },
          {
            label: "DYNAMIC",
            title: "Execute · unknown",
            body: "interpreter나 미분류 실행으로 정적 의미가 불확실합니다.",
            tone: "amber",
          },
        ]}
      />
      <BashRule>
        compound command는 각 executable을 분류하고 가장 높은 risk를 전체
        intent로 올립니다.
      </BashRule>
    </BashFrame>
  );
}
