import { MathLedger, MathVizFrame } from "../../math-viz-primitives";

export default function LagrangeFormulaViz() {
  return (
    <MathVizFrame
      eyebrow="selector 검사"
      title="각 basis는 자기 열만 1로 남긴다"
      description="세 표본점에서 ℓ₀, ℓ₁, ℓ₂를 평가하면 identity matrix가 나옵니다. 그래서 weighted sum이 각 행의 y값을 정확히 복원합니다."
      note="이 성질은 실수뿐 아니라 모든 분모 xᵢ−xⱼ가 0이 아닌 field에서도 그대로 성립합니다."
    >
      <MathLedger
        items={[
          {
            label: "AT x=0",
            value: "(ℓ₀,ℓ₁,ℓ₂)=(1,0,0)",
            meaning: "L(0)=y₀만 남음",
          },
          { label: "AT x=1", value: "(0,1,0)", meaning: "L(1)=y₁만 남음" },
          { label: "AT x=2", value: "(0,0,1)", meaning: "L(2)=y₂만 남음" },
          {
            label: "RESULT",
            value: "L(x)=Σ yᵢℓᵢ(x)",
            meaning: "표본값의 selector 합",
          },
        ]}
      />
    </MathVizFrame>
  );
}
