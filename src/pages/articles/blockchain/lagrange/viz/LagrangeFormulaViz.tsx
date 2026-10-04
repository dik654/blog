import { MathLedger, MathVizFrame } from "../../math-viz-primitives";

export default function LagrangeFormulaViz() {
  return (
    <MathVizFrame
      eyebrow="기저 값 확인"
      title="각 기저는 자기 표본 위치에서만 1입니다"
      description="각 위치에서 세 기저를 계산하면 하나만 1이고 나머지는 0입니다. 여기에 1·4·9를 곱해 더하면 그 위치의 기록이 남습니다."
      note="분모가 0이 아닌 같은 체에서 계산합니다. F17의 표본 위치 0·1·2는 서로 다릅니다."
    >
      <MathLedger
        items={[
          {
            label: "입력 x=0",
            value: "(ℓ₀,ℓ₁,ℓ₂)=(1,0,0)",
            meaning: "L(0)=y₀만 남음",
          },
          { label: "입력 x=1", value: "(0,1,0)", meaning: "L(1)=y₁만 남음" },
          { label: "입력 x=2", value: "(0,0,1)", meaning: "L(2)=y₂만 남음" },
          {
            label: "합친 규칙",
            value: "L(x)=Σ yᵢℓᵢ(x)",
            meaning: "세 기저에 1·4·9를 곱해 더합니다.",
          },
        ]}
      />
    </MathVizFrame>
  );
}
