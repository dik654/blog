import { MathFlow, MathVizFrame } from "../../math-viz-primitives";

export default function LagrangeConceptViz() {
  return (
    <MathVizFrame
      eyebrow="보간의 목표"
      title="n개의 서로 다른 점을 degree n−1 이하 다항식 하나로 연결한다"
      description="각 입력점에서 자기 값만 남기는 selector polynomial을 만들고, 그 selector를 목표 y값만큼 가중해 더합니다."
      note="x 좌표가 겹치면 분모가 0이 되어 일반적인 함수의 보간 문제가 아닙니다."
    >
      <MathFlow
        steps={[
          {
            label: "DATA",
            title: "서로 다른 점",
            body: "(0,1), (1,4), (2,9)처럼 x가 겹치지 않아야 합니다.",
          },
          {
            label: "SELECT",
            title: "ℓᵢ를 만든다",
            body: "xᵢ에서는 1, 나머지 표본점에서는 0이 되게 합니다.",
          },
          {
            label: "WEIGHT",
            title: "yᵢℓᵢ",
            body: "선택된 위치에 목표 y값을 붙입니다.",
          },
          {
            label: "SUM",
            title: "모두 더한다",
            body: "L(x)=Σyᵢℓᵢ가 모든 점을 통과합니다.",
            code: "L(x)=(x+1)²",
          },
        ]}
      />
    </MathVizFrame>
  );
}
