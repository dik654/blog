import { MathFlow, MathVizFrame } from "../../math-viz-primitives";

export default function VanishingViz() {
  return (
    <MathVizFrame
      eyebrow="도메인 전체 제약"
      title="모든 도메인 점에서 0이라는 조건을 divisibility 하나로 바꾼다"
      description="H의 모든 점을 root로 갖는 vanishing polynomial Z_H를 만들면, C가 H 전체에서 0인 조건은 C가 Z_H로 나누어떨어지는 조건과 같습니다."
      note="degree(C)가 충분히 작다는 전제 없이 몇 점에서 0이라는 관찰만으로 C가 zero polynomial이라고 결론 내리면 안 됩니다."
    >
      <MathFlow
        steps={[
          {
            label: "DOMAIN",
            title: "H={0,1,2}",
            body: "검사할 유한한 평가점 집합을 정합니다.",
          },
          {
            label: "VANISH",
            title: "Z_H=x(x−1)(x−2)",
            body: "각 점을 factor 하나의 root로 만듭니다.",
          },
          {
            label: "DIVIDE",
            title: "C=Q·Z_H",
            body: "나머지가 0인지 polynomial division으로 확인합니다.",
          },
          {
            label: "CONCLUDE",
            title: "C(h)=0 for all h∈H",
            body: "각 h에서 Z_H(h)=0이므로 제약이 동시에 성립합니다.",
          },
        ]}
      />
    </MathVizFrame>
  );
}
