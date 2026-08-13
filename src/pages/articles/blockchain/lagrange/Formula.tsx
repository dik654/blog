import ExplainedFormula from "@/components/ui/explained-formula";
import LagrangeFormulaViz from "./viz/LagrangeFormulaViz";

export default function Formula() {
  return (
    <section id="formula" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Basis polynomial을 만들고 가중해 더하기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          i번째 selector ℓᵢ는 다른 표본점 xⱼ에서는 numerator factor x−xⱼ 하나가
          0이 되어 꺼지고, 자기 점 xᵢ에서는 numerator와 denominator가 같아져 1이
          됩니다. 이 Kronecker-delta 성질 때문에 yᵢℓᵢ를 모두 더하면 원하는
          표본값이 하나씩 남습니다.
        </p>
      </div>
      <LagrangeFormulaViz />
      <ExplainedFormula
        question="n개의 평가값을 통과하는 degree n−1 이하 다항식을 어떻게 직접 만들까요?"
        idea="각 표본점을 위한 selector를 만든 뒤 그 위치의 목표값만큼 가중합니다. Selector는 자기 점에서 1이고 다른 점에서 0입니다."
        formula={String.raw`\ell_i(x)=\prod_{j\ne i}\frac{x-x_j}{x_i-x_j},\qquad L(x)=\sum_{i=0}^{n-1}y_i\ell_i(x)`}
        terms={[
          {
            symbol: "x_i,y_i",
            name: "sample point",
            description: "서로 다른 x 좌표와 그 위치의 목표값입니다.",
          },
          {
            symbol: String.raw`\ell_i`,
            name: "Lagrange basis",
            description: "xᵢ에서 1, 다른 xⱼ에서 0인 selector polynomial입니다.",
          },
          {
            symbol: "L",
            name: "interpolant",
            description: "모든 sample을 통과하는 degree n−1 이하 다항식입니다.",
          },
          {
            symbol: "x_i-x_j",
            name: "normalizer",
            description:
              "자기 위치의 selector 값을 1로 만드는 field inverse 대상입니다.",
          },
        ]}
        assumptions={[
          "모든 xᵢ는 서로 달라 분모가 0이 아닙니다.",
          "계수 domain은 0이 아닌 분모의 inverse가 있는 field입니다.",
        ]}
        interpretation="(0,1),(1,4),(2,9)를 넣으면 L(x)=x²+2x+1입니다. x=1에서는 ℓ₁만 1이므로 L(1)=4가 즉시 확인됩니다."
      />
    </section>
  );
}
