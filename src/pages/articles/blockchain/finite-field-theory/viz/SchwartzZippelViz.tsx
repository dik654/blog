import { MathFlow, MathVizFrame } from "../../math-viz-primitives";

export default function SchwartzZippelViz() {
  return (
    <MathVizFrame
      eyebrow="확률적 다항식 검사"
      title="긴 다항식 항등식을 무작위 한 점으로 압축한다"
      description="서로 다른 두 다항식의 차이는 0이 아닌 다항식입니다. 차수가 d라면 field 안에서 root는 많아야 d개이므로, 큰 집합에서 무작위로 고른 점이 우연히 root일 확률을 제한할 수 있습니다."
      note="이 bound는 점을 독립적이고 균등하게 선택하며, 평가 집합의 크기가 차수보다 충분히 클 때만 유용합니다."
    >
      <MathFlow
        steps={[
          {
            label: "CLAIM",
            title: "P와 Q가 같은가?",
            body: "계수를 전부 비교하는 대신 차이 R=P−Q를 만듭니다.",
          },
          {
            label: "SAMPLE",
            title: "r을 무작위 선택",
            body: "검증자가 평가 집합 S에서 challenge를 고릅니다.",
            code: "r ← S",
          },
          {
            label: "CHECK",
            title: "R(r)=0 검사",
            body: "다르면 대부분의 점에서 값이 달라집니다.",
          },
          {
            label: "BOUND",
            title: "거짓 통과 ≤ d/|S|",
            body: "R의 root 수가 degree d보다 많을 수 없다는 사실을 씁니다.",
          },
        ]}
      />
    </MathVizFrame>
  );
}
