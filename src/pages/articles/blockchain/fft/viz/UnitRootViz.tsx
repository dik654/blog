import { MathLedger, MathVizFrame } from "../../math-viz-primitives";

export default function UnitRootViz() {
  return (
    <MathVizFrame
      eyebrow="유한체 단위근"
      title="F₁₇의 원시 8차 단위근 ω=2가 여덟 평가점을 만든다"
      description="ω⁸=1이고 그보다 작은 양의 지수에서는 1이 되지 않으므로, 1,ω,…,ω⁷이 서로 다른 8개 점을 순회합니다."
      note="ω⁴=−1은 butterfly의 덧셈·뺄셈 쌍을 만듭니다. 이 도메인이 존재하려면 8이 |F₁₇*|=16을 나눠야 합니다."
    >
      <MathLedger
        items={[
          { label: "ω⁰…ω¹", value: "1 → 2", meaning: "첫 두 평가점" },
          { label: "ω²…ω³", value: "4 → 8", meaning: "반복 곱셈으로 이동" },
          { label: "ω⁴…ω⁵", value: "16 → 15", meaning: "ω⁴=16=−1 mod 17" },
          {
            label: "ω⁶…ω⁸",
            value: "13 → 9 → 1",
            meaning: "여덟 단계 뒤 처음으로 복귀",
          },
        ]}
      />
    </MathVizFrame>
  );
}
