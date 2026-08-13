import { MathFlow, MathVizFrame } from "../../math-viz-primitives";

export default function NTTConceptViz() {
  return (
    <MathVizFrame
      eyebrow="표현 전환"
      title="계수 곱을 평가값의 pointwise 곱으로 바꾼다"
      description="NTT는 다항식 계수를 유한체 단위근에서의 평가값으로 바꾸며, INTT는 다시 계수로 돌아옵니다. 충분히 padding하면 linear polynomial product를 O(n log n)에 계산할 수 있습니다."
      note="평가 도메인의 크기는 결과 degree보다 커야 합니다. 그렇지 않으면 xⁿ−1을 기준으로 감기는 cyclic product가 됩니다."
    >
      <MathFlow
        steps={[
          {
            label: "COEFFICIENT",
            title: "a,b 계수",
            body: "직접 convolution은 계수 쌍을 모두 곱합니다.",
            code: "O(n²)",
          },
          {
            label: "NTT",
            title: "단위근에서 평가",
            body: "같은 ωⁱ에서 A와 B의 값을 계산합니다.",
            code: "O(n log n)",
          },
          {
            label: "POINTWISE",
            title: "A(ωⁱ)B(ωⁱ)",
            body: "각 도메인 점은 서로 독립적으로 곱합니다.",
            code: "O(n)",
          },
          {
            label: "INTT",
            title: "결과 계수 복원",
            body: "ω⁻¹과 n⁻¹로 inverse transform합니다.",
            code: "O(n log n)",
          },
        ]}
      />
    </MathVizFrame>
  );
}
