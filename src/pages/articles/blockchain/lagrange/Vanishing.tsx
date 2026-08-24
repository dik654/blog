import ExplainedFormula from "@/components/ui/explained-formula";
import VanishingViz from "./viz/VanishingViz";

export default function Vanishing() {
  return (
    <section id="vanishing" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Vanishing polynomial로 도메인 전체를 묶기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          유한 집합 H의 모든 점에서 0이 되는 가장 단순한 다항식은 각 점 h를
          root로 갖는 factor (x−h)를 모두 곱한 Z_H입니다. ZK arithmetization은
          각 row에서 성립해야 할 constraint C(h)=0을 polynomial divisibility
          C=QZ_H로 바꿉니다.
        </p>
      </div>
      <VanishingViz />
      <ExplainedFormula
        question="C가 H의 모든 점에서 0인지 왜 Z_H divisibility로 검사할 수 있을까요?"
        idea="C의 각 root h에 대응하는 factor x−h가 C를 나눕니다. h들이 서로 다르면 이 factor의 곱 Z_H 전체가 C를 나눕니다. 역방향은 대입하면 곧바로 확인됩니다."
        formula={String.raw`Z_H(x)=\prod_{h\in H}(x-h),\qquad \bigl[\forall h\in H:C(h)=0\bigr]\iff Z_H(x)\mid C(x)`}
        annotatedFormula={String.raw`Z_H(x)=\underbrace{\prod_{h\in H}(x-h),\qquad \bigl[\forall h\in H:C(h)=0\bigr]\iff Z_H(x)\mid C(x)}_{\text{vanishing polynomial 계산}}`}
        operations={[
          { expression: String.raw`\prod_{h\in H}(x-h),\qquad \bigl[\forall h\in H:C(h)=0\bigr]\iff Z_H(x)\mid C(x)`, annotation: ["vanishing polynomial이(가) 식의 결과에","기여하는 방식을 계산합니다.","C의 각 root h에 대응하는 factor x−h가 C를","나눕니다."] },
        ]}
        terms={[
          {
            symbol: "H",
            name: "evaluation domain",
            description:
              "constraint를 검사하는 서로 다른 field 원소 집합입니다.",
          },
          {
            symbol: "Z_H",
            name: "vanishing polynomial",
            description: "H를 정확히 root로 포함하는 degree |H| 다항식입니다.",
          },
          {
            symbol: "C",
            name: "constraint polynomial",
            description: "도메인 각 점에서 0이어야 하는 식입니다.",
          },
          {
            symbol: "Q",
            name: "quotient polynomial",
            description: "나머지가 0일 때 C/Z_H로 얻는 다항식입니다.",
          },
        ]}
        assumptions={[
          "H의 원소는 서로 다릅니다.",
          "C와 Z_H는 같은 field의 polynomial ring에 있습니다.",
        ]}
        interpretation="H={0,1,2}이면 Z_H=x(x−1)(x−2)입니다. C=Z_H(x)(x+4)는 H 전체에서 0이지만, H 밖에서도 반드시 0이라는 뜻은 아닙니다."
      />
    </section>
  );
}
