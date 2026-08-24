import ExplainedFormula from "@/components/ui/explained-formula";
import UnitRootViz from "./viz/UnitRootViz";

export default function UnitRoot() {
  return (
    <section id="unit-root" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        NTT 도메인은 field의 subgroup이다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Fₚ*의 크기는 p−1이므로 transform length n은 p−1을 나눠야 합니다.
          생성원 g에서 ω=g^((p−1)/n)을 만들면 order n인 subgroup H=
          {`{1,ω,…,ωⁿ⁻¹}`}을 얻습니다. n=2ˢ인 radix-2 NTT에는 p−1이 2ˢ를 인수로
          가져야 하며, 이 최대 s를 2-adicity라고 부릅니다.
        </p>
      </div>
      <UnitRootViz />
      <ExplainedFormula
        question="Fₚ에서 크기 n NTT를 위한 primitive root를 어떻게 만들까요?"
        idea="전체 곱셈군의 generator g를 (p−1)/n번 거듭제곱하면 order를 n으로 줄일 수 있습니다."
        formula={String.raw`n\mid(p-1),\quad \omega=g^{(p-1)/n},\quad \operatorname{ord}(\omega)=n`}
        annotatedFormula={String.raw`n\mid(p-1),\quad \omega=\underbrace{g^{(p-1)/n},\quad \operatorname{ord}(\omega)=n}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`g^{(p-1)/n},\quad \operatorname{ord}(\omega)=n`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","전체 곱셈군의 generator g를 (p−1)/n번","거듭제곱하면 order를 n으로 줄일 수 있습니다."] },
        ]}
        terms={[
          {
            symbol: "g",
            name: "group generator",
            description: "order p−1인 Fₚ*의 원소입니다.",
          },
          {
            symbol: "n",
            name: "transform length",
            description: "필요한 서로 다른 평가점의 수입니다.",
          },
          {
            symbol: String.raw`\omega`,
            name: "domain generator",
            description: "크기 n subgroup을 생성하는 primitive root입니다.",
          },
          {
            symbol: String.raw`\operatorname{ord}(\omega)`,
            name: "multiplicative order",
            description: "ωᵈ=1이 되는 가장 작은 양의 d입니다.",
          },
        ]}
        assumptions={[
          "p는 소수이고 n은 p−1을 나눕니다.",
          "g의 order가 실제로 p−1인지 검증했습니다.",
        ]}
        interpretation="F₁₇에서 g=3, n=8이면 ω=3²=9도 primitive 8th root입니다. ω=4는 order 4라 크기 8 transform에 쓰면 평가점이 중복됩니다."
      />
    </section>
  );
}
