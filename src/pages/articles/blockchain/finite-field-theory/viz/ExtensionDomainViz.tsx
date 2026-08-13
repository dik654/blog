import { MathLedger, MathVizFrame } from "../../math-viz-primitives";

export default function ExtensionDomainViz() {
  return (
    <MathVizFrame
      eyebrow="확장체"
      title="기저체에 없던 근을 기약 다항식의 관계로 추가한다"
      description="Fₚ[x]의 기약 다항식 m(x)로 나눈 나머지를 원소로 삼으면, 차수 k 미만의 계수 벡터가 pᵏ개의 원소를 가진 새 field를 이룹니다."
      note="x²+1이 항상 기약인 것은 아닙니다. 예를 들어 F₅에서는 2²+1=0이므로 quotient가 field가 되지 않습니다."
    >
      <MathLedger
        items={[
          {
            label: "BASE",
            value: "F₃",
            meaning: "계수 0,1,2를 사용하는 기저체",
          },
          {
            label: "MODULUS",
            value: "m(u)=u²+1",
            meaning: "F₃에서 root가 없는 2차 기약 다항식",
          },
          {
            label: "ELEMENT",
            value: "a+bu",
            meaning: "a,b∈F₃이므로 3²=9개 원소",
          },
          {
            label: "REDUCE",
            value: "u²=−1=2",
            meaning: "곱셈 뒤 u² 항을 이 관계로 환원",
          },
        ]}
      />
    </MathVizFrame>
  );
}
