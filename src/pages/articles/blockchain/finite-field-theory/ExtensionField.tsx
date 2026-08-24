import ExplainedFormula from "@/components/ui/explained-formula";
import ExtensionDomainViz from "./viz/ExtensionDomainViz";

export default function ExtensionField() {
  return (
    <section id="extension-field" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        확장체는 기약 다항식으로 새 원소를 만든다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          기저체 Fₚ에 필요한 root나 subgroup이 없으면 polynomial ring Fₚ[x]를
          degree k의 기약 다항식 m(x)로 나눕니다. 기약(irreducible)은 더 낮은
          degree의 nonconstant polynomial 곱으로 쪼개지지 않는다는 뜻입니다. 이
          조건이 있어야 0이 아닌 residue polynomial마다 inverse가 생깁니다.
        </p>
      </div>
      <ExtensionDomainViz />
      <ExplainedFormula
        question="degree k 기약 다항식으로 만든 확장체의 원소는 어떻게 표현할까요?"
        idea="m(x)로 나눈 나머지만 남기면 degree k 이상 항을 제거할 수 있으므로, k개의 기저체 계수가 하나의 원소를 나타냅니다."
        formula={String.raw`\mathbb F_{p^k}\cong\mathbb F_p[u]/(m(u)),\qquad a=\sum_{i=0}^{k-1}a_i u^i`}
        annotatedFormula={String.raw`\mathbb F_{p^k}\cong\mathbb F_p[u]/(m(u)),\qquad a=\underbrace{\sum_{i=0}^{k-1}a_i u^i}_{\text{irreducible modulus 계산}}`}
        operations={[
          { expression: String.raw`\sum_{i=0}^{k-1}a_i u^i`, annotation: ["irreducible modulus이(가) 식의 결과에","기여하는 방식을 계산합니다.","m(x)로 나눈 나머지만 남기면 degree k 이상 항을","제거할 수 있으므로, k개의 기저체 계수가 하나의 원소를"] },
        ]}
        terms={[
          {
            symbol: "m(u)",
            name: "irreducible modulus",
            description: "Fₚ에서 degree k인 기약 다항식입니다.",
          },
          {
            symbol: "u",
            name: "adjoined element",
            description: "m(u)=0 관계를 만족하도록 추가한 형식적 원소입니다.",
          },
          {
            symbol: "a_i",
            name: "base-field coordinate",
            description: "각각 Fₚ에 속하는 k개의 계수입니다.",
          },
          {
            symbol: "p^k",
            name: "field size",
            description: "k개 좌표의 가능한 조합 수입니다.",
          },
        ]}
        assumptions={[
          "m은 Fₚ 위에서 기약입니다.",
          "곱셈 뒤 m으로 나눈 나머지로 항상 환원합니다.",
        ]}
        interpretation="F₃[u]/(u²+1)에서는 u²=2이고 원소는 a+bu의 9가지입니다. F₅에서는 같은 u²+1이 reducible이므로 다른 irreducible modulus를 골라야 합니다."
      />
    </section>
  );
}
